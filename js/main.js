function showTime() {
  var date = new Date()
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

document.querySelector(".img-menu").addEventListener("click", function () {
  var menu = document.querySelector(".dropdown-menu")
  menu.style.display = menu.style.display === "none" ? "block" : "none"
})

// Function to check for selection changes
function checkForSelectionUpdates() {
  const currentSelections =
    JSON.parse(localStorage.getItem("currentSelections")) || {}

  // Fetch the latest selections from the database
  fetch("/responder/api/selections", { cache: "no-store" }) // Replace with your API endpoint
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch selections")
      }
      return response.json()
    })
    .then((latestSelections) => {
      // Compare the latest selections with the current selections
      if (
        JSON.stringify(currentSelections) !== JSON.stringify(latestSelections)
      ) {
        console.log("Selections have changed. Refreshing...")
        localStorage.setItem(
          "currentSelections",
          JSON.stringify(latestSelections)
        )
        location.reload() // Refresh the page
      }
    })
    .catch((error) => {
      console.error("Error checking for selection updates:", error)
    })
}

// Check for updates every 30 seconds
setInterval(checkForSelectionUpdates, 10000)
