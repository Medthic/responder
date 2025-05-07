import { createClient } from "https://esm.sh/@supabase/supabase-js"

// Initialize Supabase
const SUPABASE_URL = "https://iatehzlhxnbpcdwrbtec.supabase.co"
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhdGVoemxoeG5icGNkd3JidGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MjQzODksImV4cCI6MjA2MjIwMDM4OX0.WMQ-SY9F-BtPRrcOax3yb-bcfOiw7-55xcPo3fzek30"
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

/**
 * Debounce function to throttle rapid function calls
 * @param {Function} func - The function to debounce
 * @param {number} timeout - Debounce timeout in milliseconds
 * @returns {Function} - The debounced function
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
    console.log("Saving selections...")

    const selections = {}
    const dropdowns = document.querySelectorAll("select")

    dropdowns.forEach((dropdown) => {
      selections[dropdown.id] = dropdown.value || null
    })

    console.log("Selections to save:", selections)

    const { data, error } = await supabase.from("assignments").upsert({
      id: "current", // Fixed ID for simplicity
      selections,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error saving selections:", error)
      throw error
    }

    console.log("Selections saved successfully:", data)
  } catch (error) {
    console.error("Error during saveSelections:", error)
  }
})

/**
 * Load saved dropdown selections from the Supabase database
 */
async function loadSavedSelections() {
  try {
    console.log("Loading saved selections...")

    const { data, error } = await supabase
      .from("assignments")
      .select("selections")
      .eq("id", "current")
      .single()

    if (error && error.code !== "PGRST116") throw error // Ignore "no rows" error

    if (data && data.selections) {
      console.log("Loaded selections:", data.selections)

      Object.entries(data.selections).forEach(([dropdownId, value]) => {
        const dropdown = document.getElementById(dropdownId)
        if (dropdown) {
          dropdown.value = value || "" // Set the value or default to an empty string

          // Update the background color and text color based on the selected rank
          updateDropdownBackground(dropdown)
        }
      })
    }
  } catch (error) {
    console.error("Error loading saved selections:", error)
  }
}

/**
 * Function to update dropdown background and text color based on selected rank
 * @param {HTMLSelectElement} dropdown - The dropdown element
 */
const updateDropdownBackground = (dropdown) => {
  const selectedOption = dropdown.options[dropdown.selectedIndex]
  const rank = selectedOption.dataset.rank

  switch (rank) {
    case "FFEMT":
      dropdown.style.backgroundColor = "#5d6d7e" // Background color
      dropdown.style.color = "#17202a" // Text color
      break
    case "CHF":
      dropdown.style.backgroundColor = "#d7dbdd"
      dropdown.style.color = "#17202a"
      break
    case "CAP":
      dropdown.style.backgroundColor = "#cd6155"
      dropdown.style.color = "#17202a"
      break
    case "LT":
      dropdown.style.backgroundColor = "#f4d03f"
      dropdown.style.color = "#17202a"
      break
    case "GS":
      dropdown.style.backgroundColor = "#52be80"
      dropdown.style.color = "#17202a"
      break
    default:
      dropdown.style.backgroundColor = "#2d2d30" // Default background color
      dropdown.style.color = "#ffffff" // Default text color
  }
}

/**
 * Populate dropdowns with available members and attach event listeners
 */
async function populateDropdowns() {
  try {
    console.log("Populating dropdowns...")

    const { data: members, error } = await supabase
      .from("members")
      .select("id, name, is_available, rank") // Include rank in the query
      .eq("is_available", true)
      .order("name", { ascending: true })

    if (error) throw error

    const dropdowns = document.querySelectorAll("select")

    dropdowns.forEach((dropdown) => {
      // Clear existing options
      dropdown.innerHTML = '<option value="">-- Select member --</option>'

      // Populate dropdown with members
      members.forEach((member) => {
        const option = document.createElement("option")
        option.value = member.id
        option.textContent = member.name
        option.dataset.rank = member.rank // Store rank as a data attribute

        // Apply background and text color to the option based on rank
        switch (member.rank) {
          case "FFEMT":
            option.style.backgroundColor = "#5d6d7e"
            option.style.color = "#17202a"
            break
          case "CHF":
            option.style.backgroundColor = "#d7dbdd"
            option.style.color = "#17202a"
            break
          case "CAP":
            option.style.backgroundColor = "#cd6155"
            option.style.color = "#17202a"
            break
          case "LT":
            option.style.backgroundColor = "#f4d03f"
            option.style.color = "#17202a"
            break
          case "GS":
            option.style.backgroundColor = "#52be80"
            option.style.color = "#17202a"
            break
          default:
            option.style.backgroundColor = "#ffffff" // Default background color
            option.style.color = "#000000" // Default text color
        }

        dropdown.appendChild(option)
      })

      // Attach event listener to update background and text color on change
      dropdown.addEventListener("change", () => {
        updateDropdownBackground(dropdown)
        saveSelections() // Save selections when the dropdown changes
      })

      // Set initial background and text color
      updateDropdownBackground(dropdown)
    })

    // Load previously saved selections
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
    .channel("public:assignments") // Subscribe to the "assignments" table
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "assignments",
        filter: "id=eq.current",
      },
      (payload) => {
        console.log("Change detected in selections:", payload)

        // Reload the dropdown selections when a change is detected
        loadSavedSelections()
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("Subscribed to selection changes.")
      }
    })
}

/**
 * Initialize the application when the DOM is loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  populateDropdowns()
  subscribeToSelectionChanges() // Start listening for changes
})

export {
  supabase,
  populateDropdowns,
  saveSelections,
  subscribeToSelectionChanges,
}
