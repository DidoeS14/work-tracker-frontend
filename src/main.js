/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import config from "@/config";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


initializeApp(config.firebaseConfig);

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
