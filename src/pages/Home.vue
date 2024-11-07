<template>
    <v-row justify="center" align="center" style="height: 100vh">
      <v-col cols="auto" class="text-center">
        <h1 style="margin: 4rem">Work Tracker</h1>
        <v-row justify="center" style="height: 3rem">
          <v-btn  @click="login">Sign In</v-btn>
        </v-row>
        <v-row justify="center" style="height: 3rem">
          <v-btn  @click="register">Register</v-btn>
        </v-row>
      </v-col>
    </v-row>
  </template>
  
  <script setup>
  import { useRouter } from "vue-router";
  const router = useRouter();
  
  const register = () => {
    router.push("/register");
  };
  
  const login = () => {
    router.push("/sign-in");
  };
  </script>
  