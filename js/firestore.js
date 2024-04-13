import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js"
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
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

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Function to fetch users from Firestore
async function fetchUsers(containerId) {
  const userSelect = document.getElementById(containerId)

  // Load the saved selection from Firestore
  const savedSelectionDoc = await getDoc(
    doc(db, "savedSelections", containerId)
  )
  const savedSelection = savedSelectionDoc.exists()
    ? savedSelectionDoc.data().selected
    : null

  try {
    const querySnapshot = await getDocs(collection(db, "users"))
    querySnapshot.forEach((doc) => {
      const userData = doc.data()
      const option = document.createElement("option")
      option.value = doc.id // Assuming user id is used as value
      option.textContent = userData.name // Assuming name field is present

      // If this option was the saved selection, mark it as selected
      if (savedSelection === doc.id) {
        option.selected = true
      }

      userSelect.appendChild(option)
    })

    // Save the selection to Firestore whenever it changes
    userSelect.addEventListener("change", async () => {
      await setDoc(doc(db, "savedSelections", containerId), {
        selected: userSelect.value,
      })
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
fetchUsers("trk-chauffeur")
fetchUsers("trk-officer")
fetchUsers("trk-ovm")
fetchUsers("trk-irons")
fetchUsers("trk-roof")
fetchUsers("trk-can")
fetchUsers("res-chauffeur")
fetchUsers("res-officer")
fetchUsers("res-safety")
fetchUsers("res-tool")
fetchUsers("res-crib")
fetchUsers("res-crib2")
fetchUsers("staff47")
fetchUsers("staff472")
fetchUsers("staff48")
fetchUsers("staff482")
fetchUsers("staff49")
fetchUsers("staff492")
