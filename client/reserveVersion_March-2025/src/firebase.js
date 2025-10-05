// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDSRrWbk-3MV8GW5_lWiPhQRJMU6iNtLMY',
  authDomain: 'students-dab8c.firebaseapp.com',
  projectId: 'students-dab8c',
  storageBucket: 'students-dab8c.appspot.com',
  messagingSenderId: '723650400902',
  appId: '1:723650400902:web:ce14ff3f7ff019b09af707',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
