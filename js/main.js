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
