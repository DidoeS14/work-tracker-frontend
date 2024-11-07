<template>
    <v-row justify="center" align="center" style="height: 100vh">
      <v-col cols="auto" class="text-center" style="width: 60%">
        <h1>Create an Account</h1>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          required
        ></v-text-field>
  
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Password"
          type="password"
          required
        ></v-text-field>
        <v-btn @click="register">Submit</v-btn>
      </v-col>
    </v-row>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
  import { useRouter } from "vue-router";
  
  const email = ref("");
  const password = ref("");
  const router = useRouter();
  
  // Validation rules
  const emailRules = [
    (v) => !!v || "Email is required",
    (v) => v.length >= 6 || "Email must be at least 6 characters",
  ];
  
  const passwordRules = [
    (v) => !!v || "Password is required",
    (v) => v.length >= 6 || "Password must be at least 6 characters",
  ];
  
  /**
   * @function register handles the registration using the firebase services and redirects
   * to the main page of the app
   */
  const register = () => {
    createUserWithEmailAndPassword(getAuth(), email.value, password.value)
      .then((data) => {
        console.log("Successfully registered");
        router.push("/app");
      })
      .catch((error) => {
        console.log(error.code);
        alert(error.message);
      });
  };
  </script>
  