import { initializeApp } from "@firebase/app"
import { getDatabase } from "@firebase/database"

// Initialize Firebase
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
firebase.initializeApp(firebaseConfig)

// Call function to handle form submission on page load
handleFormSubmission()

// Function to handle form submission
function handleFormSubmission() {
  // Get form data
  var name = document.getElementById("name").value
  var rank = document.getElementById("rank").value

  // Push data to Firebase
  var database = firebase.database()
  var usersRef = database.ref("users")
  var newUserRef = usersRef.push()
  newUserRef
    .set({
      name: name,
      rank: rank,
      driverStatus: "yes",
    })
    .then(function () {
      console.log("Data successfully written!")
      // Clear form fields after successful submission
      document.getElementById("name").value = ""
      document.getElementById("rank").value = ""
    })
    .catch(function (error) {
      console.error("Error writing data: ", error)
    })
}

function showTime() {
  const newLocal = new Date()
  var date = newLocal
  var h = date.getHours() // 0 - 23
  var m = date.getMinutes() // 0 - 59
  var s = date.getSeconds() // 0 - 59

  h = h < 10 ? "0" + h : h
  m = m < 10 ? "0" + m : m
  s = s < 10 ? "0" + s : s

  var time = h + ":" + m + ":" + s
  document.getElementById("Clock").innerText = time
  document.getElementById("Clock").textContent = time

  setTimeout(showTime, 1000)
}

showTime()

function getWeatherForecast() {
  fetch("https://api.weather.gov/gridpoints/PBZ/85,67/forecast")
    .then((response) => response.json())
    .then((data) => {
      const tonightForecast = data.properties.periods.find(
        (period) => period.name === "Overnight"
      )
      if (tonightForecast) {
        document.getElementById("temperature").textContent =
          tonightForecast.temperature + "°F"

        const temperature = parseInt(tonightForecast.temperature)
        if (temperature < 32) {
          document.getElementById("temperature").style.color = "#007acc" // Cold temperature
        } else if (temperature > 80) {
          document.getElementById("temperature").style.color = "#ff7858" // Hot temperature
        } else {
          document.getElementById("temperature").style.color = "#adbcc1" // Moderate temperature
        }
      } else {
        document.getElementById("temperature").textContent =
          "Failed to fetch weather data."
      }
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error)
      document.getElementById("temperature").textContent =
        "Failed to fetch weather data."
    })
}

window.onload = getWeatherForecast
