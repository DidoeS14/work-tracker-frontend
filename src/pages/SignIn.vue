
<template>
    <v-row justify="center" align="center" style="height: 100vh">
      <v-col cols="auto" class="text-center" style="width: 60%">
        <h1>Sign In</h1>
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
        <p v-if="errMsg">{{ errMsg }}</p>
        <v-btn @click="login">Submit</v-btn>
      </v-col>
    </v-row>
  </template>
<script setup>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const errMsg = ref();
const router = useRouter();

/**
 * @function login handles the logging in using the firebase services, lets
 * the user know if there is some error and if everything is fine it redirects
 * the user to the main page of the app
 */
const login = () => {
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
      console.log("Successfully signed in");
      router.push("/app");
    })
    .catch((error) => {
      console.log(error.code);
      switch (error.code) {
        case "auth/invalid-email":
          errMsg.value = "Invalid email";
          break;
        case "auth/user-not-found":
          errMsg.value = "User not found";
          break;
        case "auth/wrong-password":
          errMsg.value = "Incorrect password";
          break;
        default:
          errMsg.value = "Email or password is incorrect";
          break;
      }
    });
};
</script>
