// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app)

console.log(app)
/////////////////////////////////////////////////////////////////////////////////////////

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
