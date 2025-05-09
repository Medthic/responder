/**
 * Display the current time and update it every second
 */
function showTime() {
  const date = new Date()
  const h = String(date.getHours()).padStart(2, "0") // 0 - 23
  const m = String(date.getMinutes()).padStart(2, "0") // 0 - 59
  const s = String(date.getSeconds()).padStart(2, "0") // 0 - 59

  const time = `${h}:${m}:${s}`
  const clockElement = document.getElementById("Clock")

  if (clockElement) {
    clockElement.textContent = time
  }

  setTimeout(showTime, 1000)
}

/**
 * Toggle the visibility of the dropdown menu
 */
function toggleMenu() {
  const menu = document.querySelector(".dropdown-menu")
  if (menu) {
    menu.style.display = menu.style.display === "block" ? "none" : "block"
  }
}

/**
 * Generate dropdown menus based on provided labels
 */
function generateDropdowns(labels) {
  return labels
    .map(
      (label) => `
        <p>${label}</p>
        <select id="${label.toLowerCase().replace(/\s+/g, "-")}"></select>
      `
    )
    .join("")
}

/**
 * Generate ambulance sections based on provided name and ids
 */
function generateAmbulance(name, ids) {
  return `
    <div class="amb">
      <h2 class="containerheader">${name}</h2>
      ${ids
        .map(
          (id) => `
            <p>STAFF</p>
            <select id="${id}"></select>
          `
        )
        .join("")}
    </div>
  `
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  showTime()

  const menuButton = document.querySelector(".img-menu")
  if (menuButton) {
    menuButton.addEventListener("click", toggleMenu)
  }
})
