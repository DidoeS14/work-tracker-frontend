<template>
  <!-- Shows the data only for the current user -->
  <div style="margin: 1rem">
    <v-data-table :headers="headers" :items="userData" item-value="name">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Reports</v-toolbar-title>
        </v-toolbar>
      </template>

      <template v-slot:item.report="{ item }">
        <td class="report-cell">{{ item.report }}</td>
      </template>

      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">More info about {{ item.name }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
  <v-btn @click="getUserData" style="margin: 1rem;">Refresh</v-btn>
  <v-btn @click="downloadUserData" style="margin: 1rem;">Download</v-btn>
</template>

<script setup>
import { defineProps, ref, onMounted } from "vue";
import { getData, postData } from "@/services/api.js";
import { da } from "vuetify/locale";

// Defined the props directly in defineProps
const props = defineProps({
  email: String,
});

const userData = ref([]);

const headers = [
  { title: "Date", align: "start", sortable: true, key: "date" },
  { title: "Time", sortable: true, key: "time" },
  { title: "Report", key: "report" },
];

// Function to fetch user data from the server
/**
 * @function getUserData is async funtion that fetches the user data from the backend server
 */
const getUserData = async () => {
  try {
    // Fetch the data using the `email` from props
    const data = { email: props.email };
    const response = await postData("/csv-user", data);

    const result = response;
    if (result.userData) {
      // Update user data from the response
      userData.value = result.userData;
    } else {
      console.error("Error fetching user data", result.error);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

/**
 * @function downloadUserData makes a post request to /csv-user and gets data for the client,
 *  forms it into a .csv file and downloads it for the client
 */
const downloadUserData = async () => {
  try {
    const post_data = { email: props.email };
    const response = await postData("/csv-user", post_data);

    let csv = 'Date,Time,Report\n';

    var data = response.userData;
    console.log(data);

    if (Array.isArray(data)) {
      data.forEach((row) => {
        // If the row is an object, convert its values to a CSV row
        if (typeof row === 'object' && row !== null) {
          // Extract the values from the object and join them with commas
          const rowValues = [row.date, row.time, row.report];
          csv += rowValues.join('|');
          csv += "\n"; // Add a newline after each row
        } else {
          console.error('Each row in response should be an object');
        }
      });
    } else {
      console.error('Expected response to be an array, but got:', data);
    }

    // Create an anchor element to download the CSV file
    const anchor = document.createElement('a');
    anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    anchor.target = '_blank';
    anchor.download = `reports.data.${props.email}.csv`; // Use email as the filename
    anchor.click();

  } catch (error) {
    console.error("Error downloading user data:", error);
  }
};


// Call getUserData on component mount
onMounted(() => {
  getUserData();
});
</script>
<style scoped>
.report-cell {
  width: 50rem;
  max-width: 50rem;
  /* Set a max-width for the report cell */
  white-space: normal;
  /* Allows text to break into new lines */
  word-wrap: break-word;
  /* Breaks long words */
  overflow-wrap: break-word;
  /* Ensures long words break and wrap */
  max-height: 100px;
  /* Max height of the report cell */
  overflow-y: auto;
  /* Allows vertical scrolling if content exceeds the height */
  padding: 4px;
  /* Add some padding for spacing */
  display: block;
  /* Ensures the content behaves like a block element */
}

/* Optional: Style for when the content exceeds 50 characters */
.report-cell::after {
  content: "";
  display: block;
  background: #f0f0f0;
  margin-top: 4px;
}
</style>
