import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js"
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyCXkNsf5a6xdNNV3KHuxR8sFwBjMwWnQZo",
  authDomain: "responder-gg.firebaseapp.com",
  databaseURL: "https://responder-gg-default-rtdb.firebaseio.com",
  projectId: "responder-gg",
  storageBucket: "responder-gg.appspot.com",
  messagingSenderId: "283970004750",
  appId: "1:283970004750:web:27ad83b13555f5c78a595f",
  measurementId: "G-96WCVVYHQW",
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore()
