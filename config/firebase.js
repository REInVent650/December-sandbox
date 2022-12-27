import firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDOnjC0vHckQhWhZOvMhrWvXRmTnSQY0Mc",
  authDomain: "december-sandbox.firebaseapp.com",
  databaseURL: "https://december-sandbox-default-rtdb.firebaseio.com",
  projectId: "december-sandbox",
  storageBucket: "december-sandbox.appspot.com",
  messagingSenderId: "775531210491",
  appId: "1:775531210491:web:fb15f28e7fb0a6545a325e",
  measurementId: "G-JFNDGTGBX3"
};

let Firebase;

if (firebase.apps.length === 0) {
    Firebase = firebase.initializeApp(firebaseConfig);
}

export default Firebase;
