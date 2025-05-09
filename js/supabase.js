import { createClient } from "https://esm.sh/@supabase/supabase-js"

// Initialize Supabase
const SUPABASE_URL = "https://iatehzlhxnbpcdwrbtec.supabase.co"
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhdGVoemxoeG5icGNkd3JidGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MjQzODksImV4cCI6MjA2MjIwMDM4OX0.WMQ-SY9F-BtPRrcOax3yb-bcfOiw7-55xcPo3fzek30"
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

/**
 * Debounce function to throttle rapid function calls
 */
function debounce(func, timeout = 1000) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => func.apply(this, args), timeout)
  }
}

/**
 * Save dropdown selections to the Supabase database
 */
const saveSelections = debounce(async () => {
  try {
    const selections = {}
    document.querySelectorAll("select").forEach((dropdown) => {
      selections[dropdown.id] = dropdown.value || null
    })

    const { error } = await supabase.from("assignments").upsert({
      id: "current",
      selections,
      updated_at: new Date().toISOString(),
    })

    if (error) throw error
    console.log("Selections saved successfully.")
  } catch (error) {
    console.error("Error saving selections:", error)
  }
})

/**
 * Load saved dropdown selections from the Supabase database
 */
async function loadSavedSelections() {
  try {
    const { data, error } = await supabase
      .from("assignments")
      .select("selections")
      .eq("id", "current")
      .single()

    if (error && error.code !== "PGRST116") throw error

    if (data?.selections) {
      Object.entries(data.selections).forEach(([dropdownId, value]) => {
        const dropdown = document.getElementById(dropdownId)
        if (dropdown) {
          dropdown.value = value || ""
          updateDropdownBackground(dropdown)
        }
      })
    }
  } catch (error) {
    console.error("Error loading saved selections:", error)
  }
}

/**
 * Update dropdown background and text color based on selected rank
 */
const updateDropdownBackground = (dropdown) => {
  const rankColors = {
    FFEMT: { bg: "#5d6d7e", text: "#17202a" },
    FF: { bg: "#5d6d7e", text: "#17202a" },
    CHF: { bg: "#d7dbdd", text: "#17202a" },
    CAP: { bg: "#cd6155", text: "#17202a" },
    LT: { bg: "#f4d03f", text: "#17202a" },
    GS: { bg: "#52be80", text: "#17202a" },
    Medic: { bg: "#407294", text: "#17202a" },
    EMT: { bg: "#a2ded0", text: "#17202a" },
    default: { bg: "#2d2d30", text: "#ffffff" },
  }

  const rank =
    dropdown.options[dropdown.selectedIndex]?.dataset.rank || "default"
  const { bg, text } = rankColors[rank] || rankColors.default

  // Apply styles to the dropdown
  dropdown.style.backgroundColor = bg
  dropdown.style.color = text

  // Ensure styles persist even when the dropdown is focused
  dropdown.style.setProperty("background-color", bg, "important")
  dropdown.style.setProperty("color", text, "important")
}

/**
 * Populate dropdowns with available members and attach event listeners
 */
async function populateDropdowns() {
  try {
    const { data: members, error } = await supabase
      .from("members")
      .select("id, name, is_available, rank")
      .eq("is_available", true)
      .order("name", { ascending: true })

    if (error) throw error

    document.querySelectorAll("select").forEach((dropdown) => {
      dropdown.innerHTML = '<option value="">-- Select member --</option>'
      members.forEach((member) => {
        const option = document.createElement("option")
        option.value = member.id
        option.textContent = member.name
        option.dataset.rank = member.rank

        // Apply rank-specific colors to the option
        const rankColors = {
          FFEMT: { bg: "#5d6d7e", text: "#17202a" },
          FF: { bg: "#5d6d7e", text: "#17202a" },
          CHF: { bg: "#d7dbdd", text: "#17202a" },
          CAP: { bg: "#cd6155", text: "#17202a" },
          LT: { bg: "#f4d03f", text: "#17202a" },
          GS: { bg: "#52be80", text: "#17202a" },
          Medic: { bg: "#407294", text: "#17202a" },
          EMT: { bg: "#a2ded0", text: "#17202a" },
          default: { bg: "#2d2d30", text: "#ffffff" },
        }

        const { bg, text } = rankColors[member.rank] || rankColors.default
        option.style.backgroundColor = bg
        option.style.color = text

        dropdown.appendChild(option)
      })

      dropdown.addEventListener("change", () => {
        updateDropdownBackground(dropdown)
        saveSelections()
      })

      updateDropdownBackground(dropdown)
    })

    await loadSavedSelections()
  } catch (error) {
    console.error("Error populating dropdowns:", error)
  }
}

/**
 * Subscribe to real-time updates for dropdown selections
 */
function subscribeToSelectionChanges() {
  supabase
    .channel("public:assignments")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "assignments",
        filter: "id=eq.current",
      },
      () => loadSavedSelections()
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED")
        console.log("Subscribed to selection changes.")
    })
}

/**
 * Subscribe to real-time updates for the scrolling message
 */
function subscribeToScrollingMessageChanges() {
  supabase
    .channel("public:scrolling_messages")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "scrolling_messages",
        filter: "is_active=eq.true",
      },
      () => fetchScrollingMessage() // Fetch the updated message
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("Subscribed to scrolling message changes.")
      }
    })
}

/**
 * Populate the rank dropdown with predefined rank options
 */
function populateRankDropdown() {
  const rankDropdown = document.getElementById("member-rank")
  if (rankDropdown) {
    rankDropdown.innerHTML = '<option value="">Select Rank</option>'
    const ranks = ["FFEMT", "FF", "CHF", "CAP", "LT", "GS", "Medic", "EMT"]
    ranks.forEach((rank) => {
      const option = document.createElement("option")
      option.value = rank
      option.textContent = rank
      rankDropdown.appendChild(option)
    })
  }
}

/**
 * Handle Admin Form Submission
 */
function handleAdminFormSubmission() {
  const adminForm = document.getElementById("admin-form")
  const adminMessage = document.getElementById("admin-message")

  if (adminForm) {
    adminForm.addEventListener("submit", async (event) => {
      event.preventDefault()
      const name = document.getElementById("member-name").value.trim()
      const rank = document.getElementById("member-rank").value.trim()

      if (!name || !rank) {
        adminMessage.textContent = "Please fill out all fields."
        adminMessage.style.color = "red"
        return
      }

      try {
        const { error } = await supabase
          .from("members")
          .insert([{ name, rank }])
        if (error) throw error

        adminMessage.textContent = `Member "${name}" with rank "${rank}" added successfully!`
        adminMessage.style.color = "green"
        adminForm.reset()
      } catch (error) {
        console.error("Error adding member:", error)
        adminMessage.textContent = "Failed to add member. Please try again."
        adminMessage.style.color = "red"
      }
    })
  }
}

/**
 * Fetch and display the scrolling message from the database
 */
async function fetchScrollingMessage() {
  const scrollingText = document.querySelector("#scrolling-message marquee")
  try {
    const { data, error } = await supabase
      .from("scrolling_messages")
      .select("content")
      .eq("is_active", true)
      .single()

    if (error) throw error
    scrollingText.textContent = data.content || "No active message available."
  } catch (error) {
    console.error("Error fetching scrolling message:", error)
    scrollingText.textContent = "Error loading message."
  }
}

/**
 * Load the current scrolling message into the admin page edit box
 */
async function loadScrollingMessageIntoEditBox() {
  const messageContent = document.getElementById("message-content")
  if (!messageContent) {
    console.error("Message content text box not found.")
    return
  }

  try {
    const { data, error } = await supabase
      .from("scrolling_messages")
      .select("content")
      .eq("is_active", true)
      .single()

    if (error) throw error

    // Populate the text box with the current message
    messageContent.value = data?.content || ""
  } catch (error) {
    console.error("Error loading scrolling message:", error)
    messageContent.value = "Error loading message."
  }
}

/**
 * Handle Scrolling Message Form Submission
 */
function handleScrollingMessageFormSubmission() {
  const form = document.getElementById("scrolling-message-form")
  const messageContent = document.getElementById("message-content")
  const messageStatus = document.getElementById("message-status")

  if (!form || !messageContent) {
    console.error("Scrolling message form or text box not found.")
    return
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault()

    const newMessage = messageContent.value.trim()
    if (!newMessage) {
      messageStatus.textContent = "Message cannot be empty."
      messageStatus.style.color = "red"
      return
    }

    try {
      // Update the scrolling message in the database
      const { error } = await supabase
        .from("scrolling_messages")
        .update({ content: newMessage })
        .eq("is_active", true)

      if (error) throw error

      messageStatus.textContent = "Message updated successfully!"
      messageStatus.style.color = "green"

      // Optionally, refresh the scrolling message on the page
      fetchScrollingMessage()
    } catch (error) {
      console.error("Error updating scrolling message:", error)
      messageStatus.textContent = "Failed to update message. Please try again."
      messageStatus.style.color = "red"
    }
  })
}

/**
 * Initialize the application
 */
document.addEventListener("DOMContentLoaded", () => {
  populateRankDropdown()
  populateDropdowns()
  subscribeToSelectionChanges()
  handleAdminFormSubmission()
  fetchScrollingMessage()
  loadScrollingMessageIntoEditBox()

  // Initialize scrolling message form submission and subscription
  handleScrollingMessageFormSubmission()
  subscribeToScrollingMessageChanges()
})

export {
  supabase,
  populateDropdowns,
  saveSelections,
  subscribeToSelectionChanges,
}
