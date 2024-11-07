<template>
  <div>
    <div>
      <p>Time: {{ currentTime }} hours</p> <!-- Display the current time -->
    </div>

    <!-- Start the timer -->
    <v-btn @click="startTimer" variant="elevated" color="green" style="margin: 1rem;" :disabled="timerRunning">
      Start
    </v-btn>

    <!-- Stop the timer -->
    <v-btn @click="stopTimer" variant="elevated" color="red" style="margin: 1rem;" :disabled="!timerRunning || !report || report.length < 10">
      Stop
    </v-btn>

    <!-- Textarea for writing a report -->
    <v-textarea
      v-model="report"
      :rules="rules"
      hide-details="auto"
      label="Write a report in order to stop the timer"
    ></v-textarea>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { postData } from "@/services/api.js";
import { getCurrentUser } from "@/router/index.js";

const report = ref(''); // Report written by the user
const timerRunning = ref(false); // Track if the timer is running
const currentTime = ref('00:00:00'); // Display time in HH:mm:ss format
let startTime = 0; // Store the start time (in milliseconds)
let intervalId = null; // Store the interval ID to clear the timer when stopped
let currentUserEmail = null; // Store the current user's email

// Validation rules for the report
const rules = [
  value => !!value || 'Required.',
  value => (value && value.length >= 10) || 'Min 10 characters',
];

/**
 * Fetches current user and initialize timer state
 */
onMounted(async () => {
  try {
    const currentUser = await getCurrentUser();
    currentUserEmail = currentUser.email; 

    const storedStartTime = localStorage.getItem(`startTime_${currentUserEmail}`);
    const storedTimerRunning = localStorage.getItem(`timerRunning_${currentUserEmail}`);

    // Retrieve the timer state only if it was running for this user
    if (storedStartTime && storedTimerRunning === 'true') {
      startTime = parseInt(storedStartTime);
      timerRunning.value = true;
      intervalId = setInterval(() => {
        if (timerRunning.value) {
          currentTime.value = formatTime(Date.now() - startTime);
        } else {
          clearInterval(intervalId); // Stop the interval when timer stops
        }
      }, 1000);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
});

/**
 * @function setTimer starts the timer
 */
const startTimer = () => {
  if (timerRunning.value) return; // Do nothing if the timer is already running

  // Reset the current time and start the timer
  currentTime.value = '00:00:00';
  timerRunning.value = true;
  startTime = Date.now(); // Store the start time
  localStorage.setItem(`startTime_${currentUserEmail}`, startTime); // Save start time with user-specific key
  localStorage.setItem(`timerRunning_${currentUserEmail}`, 'true'); // Mark the timer as running with user-specific key

  intervalId = setInterval(() => {
    if (timerRunning.value) {
      currentTime.value = formatTime(Date.now() - startTime);
    } else {
      clearInterval(intervalId); // Stop the interval when timer stops
    }
  }, 1000);
};

/**
 * @function stopTimer stops the timer and sends data to the backend server via api
 */
const stopTimer = async () => {
  timerRunning.value = false; 
  clearInterval(intervalId); 

  // Send email, time, and report to the API
  try {
    const data = {
      email: currentUserEmail, 
      time: currentTime.value,  
      report: report.value,     
    };

    await postData("/stop-timer", data);
    console.log("Data sent to API:", data);

    // Clear localStorage data for this user after stopping the timer
    localStorage.removeItem(`startTime_${currentUserEmail}`);
    localStorage.removeItem(`timerRunning_${currentUserEmail}`);
    report.value = "";
  } catch (error) {
    console.error("Error sending data to API:", error);
  }
};

/**
 * Helper function that formats the time in format HH:mmm:ss
 * @param milliseconds variable of time in miliseconds
 */
const formatTime = (milliseconds) => {
  const date = new Date(milliseconds);
  return date.toISOString().substr(11, 8); // Format as HH:mm:ss
};
</script>
