import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js"
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  setDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js"

//...

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

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Function to fetch users from Firestore
async function fetchUsers(containerId) {
  const userSelect = document.getElementById(containerId)

  try {
    const querySnapshot = await getDocs(collection(db, "users"))
    querySnapshot.forEach((doc) => {
      const userData = doc.data()
      const option = document.createElement("option")
      option.value = doc.id // Assuming user id is used as value
      option.textContent = userData.name // Assuming name field is present
      userSelect.appendChild(option)
    })

    // Add change event listener to save selection to the container
    selectElement.onSnapshot("change", function (event) {
      const selectedUserId = event.target.value
      userSelections[containerId] = selectedUserId
      console.log(
        "Selection in container " + containerId + ": " + selectedUserId
      )
    })
  } catch (error) {
    console.error("Error fetching users: ", error)
  }
}

// Call fetchUsers when the page loads
fetchUsers("eng-chauffeur")
fetchUsers("eng-officer")
fetchUsers("eng-nozzle")
fetchUsers("eng-layout")
fetchUsers("eng-forcible")
fetchUsers("eng-backup")
