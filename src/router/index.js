import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Feed from '@/pages/Feed.vue'; // Make sure the import paths are correct
import Register from '../pages/Register.vue';
import SignIn from '@/pages/SignIn.vue';
import Home from '../pages/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home, // Home page when user goes to '/'
  },
  {
    path: '/app',
    name: 'Feed',
    component: Feed, // App page (originally called Feed)
    meta:{ requiresAuth: true,},
  },
  {
    path: '/register',
    name: 'Register',
    component: Register, // Registration page
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: SignIn, // Sign In page
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

/**
 * @function getCurrentUser get's the currently logged in user
 * @returns Promise
 */
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(getAuth(),
    (user) => {
      removeListener();
      resolve(user);
    },
    reject);
  });
};
router.beforeEach(async(to, from, next)=>{
  if(to.matched.some((record) => record.meta.requiresAuth)){
    if(await getCurrentUser()){
      next();
    } else{
      alert("you don't have access to this page!");
      next("/");
    }
  }else{
    next();
  }
});

export default router;
