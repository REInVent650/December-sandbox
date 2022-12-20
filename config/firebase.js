import firebase from 'firebase/app';
import 'firebase/auth';

// Initialize Firebase
export const firebaseConfig = {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
};

let Firebase;

if (firebase.apps.length === 0) {
    Firebase = firebase.initializeApp(firebaseConfig);
}

export default Firebase;
