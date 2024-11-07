<template>
    <v-row justify="center" align="center" style="height: 100vh">
      <v-col cols="auto" class="text-center">
        <h1 style="margin: 2rem">Work Tracker</h1>
        <div v-if="isAdmin"><UserAdminTable  /></div>
        <div v-else style="margin-left: 1rem; margin-right: 1rem">
          <UsersPanel />
        </div>  
        <div v-if="isAdmin">
            <!-- noqa -->
        </div>
        <!-- Ensure currentUser is not null before passing email prop -->
        <div v-else v-if="currentUser">
          <UserPersonalTable :email="currentUser.email" style="margin: rem;"/>
        </div>
      </v-col>
    </v-row>
  </template>
  
  <script setup>
  import { useRouter } from "vue-router";
  import { getCurrentUser } from "@/router/index.js";
  import { postData } from "@/services/api.js";
  import { ref, onMounted } from "vue";
  import UsersPanel from "@/components/UsersPanel.vue";
  
  const router = useRouter();
  const isAdmin = ref(false); 
  let currentUser = ref(null); 
  
  /**
   * @function validateAdmin checks if the current user is admin by making a request
   * to the backend server which checks if the uid of the current user maches the any
   * of the uid's that are defined for admins
   * @param uid this is a unique identificator for each user, which can be taken from the 
   * firebase users table or current firebase client
   */
  const validateAdmin = async (uid) => {
    try {
      const result = await postData("/admin-auth", uid);
      isAdmin.value = result.admin; // Correctly update the reactive `isAdmin` value
      return result; // Return the result if needed
    } catch (error) {
      console.error("Error validating admin:", error);
      throw error; // Re-throw the error if needed
    }
  };
  
  /**
   * Checks if the user is admin or a regular user 
   * so it can display the corresponding components
   */
  onMounted(async () => {
    try {
      currentUser.value = await getCurrentUser();
      if (currentUser.value) {
        await validateAdmin(currentUser.value.uid); 
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  });
  </script>
  