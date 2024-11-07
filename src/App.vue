<template>
  <v-app>
    <v-main>
      <nav style="display: flex; justify-content: flex-end; padding: 0.5rem">
        <p
          v-if="isLoggedIn"
          style="
            margin-right: 1rem;
            margin-top: 0.5rem;
            font-size: 1.1rem;
            font-weight: 500;
            padding: 0rem 1rem;
            border-radius: 8px;
            display: inline-block;
          "
        >
          {{ user ? user.email : '' }}
        </p>

        <p v-if="isLoggedIn" style="margin-right: 1rem; margin-top: 0.5rem">🔑</p>
        <v-btn @click="handleSignOut" v-if="isLoggedIn">Sign out</v-btn>
      </nav>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const isLoggedIn = ref(false);
const user = ref(null); 
const router = useRouter();

let auth;
onMounted(async () => {
  auth = getAuth();

  /**
   * @function onAuthStateChanged to detect if user has logged in or out
   */
  onAuthStateChanged(auth, (firebaseUser) => {
    isLoggedIn.value = !!firebaseUser;
    user.value = firebaseUser; // Set user to firebaseUser
  });
});

/**
 * @function handleSignOut
 * Sets the user as logged off and redirects to home page
 */
const handleSignOut = () => {
  signOut(auth)
    .then(() => {
      isLoggedIn.value = false;
      user.value = null; // Clear user ref after sign out
      router.push("/"); // Redirect to home page
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
};
</script>
