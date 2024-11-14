
# Work Tracker Frontend ⏱

This is the frontend side of a project for tracking worked hours and daily reports in presumably a company or some organization. 
## About the project 📑

The backend for this project can be found [here](https://github.com/DidoeS14/work-tracker-backend?tab=readme-ov-file).

The project uses [Firebase](https://firebase.google.com)🔥 for authentication. You must have profile there and a running project in order to create profiles. I recommend [this](https://learnvue.co/articles/vue-firebase-authentication) tutorial from LearnVue.

After you setup your profile and project there you will need to fill your project credentials inside src/config.js as follows:

```javascript
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

```

## Run Locally 💻

Clone the project

```bash
  git clone https://github.com/DidoeS14/work-tracker-frontend.git
```

Go to the project directory

```bash
  cd work-tracker-frontend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Deployment 📦
 
To deploy this project run

```bash
  npm run build
```

## Features

- User/Admin authentication
- Time tracking
- Push reports
- User personal reports preview
- User personal reports download
- Admin global repoerts preview
- Admin global repoerts download

## Tech Stack 🔧

**Client:** Vue, Vuetify, Firebase, Axios

**Server:** Node


## Related 🔗

Backend project:

[Work Tracker Backend](https://github.com/DidoeS14/work-tracker-backend?tab=readme-ov-file)

