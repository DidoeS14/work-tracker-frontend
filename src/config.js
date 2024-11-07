import version from '../package.json';


export default {
  apiBaseUrl: 'http://localhost:5000',// change to the address of your server
  authKey: 'authenticationKey',
  appTitle: 'Work Tracker',
  version: version,
  firebaseConfig: {                 //place here your firebase credentials
    apiKey: "your-api-key",
    authDomain: "your-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-message-sender-id",
    appId: "your-app-id"
  }
};
