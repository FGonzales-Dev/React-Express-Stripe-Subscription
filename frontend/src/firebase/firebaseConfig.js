import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/database"
import "firebase/compat/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyC3F-w3F_z4vUbS7Bth9YZLbo_EoG8--PM",
    authDomain: "stripe-subscription-prototype.firebaseapp.com",
    databaseURL: "https://stripe-subscription-prototype-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "stripe-subscription-prototype",
    storageBucket: "stripe-subscription-prototype.appspot.com",
    messagingSenderId: "1088853797108",
    appId: "1:1088853797108:web:3b3e8e660a026cf05f96a1",
    measurementId: "G-D2LPNDSLN6"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export default firebase