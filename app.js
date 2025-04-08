// Initialize Flatpickr for date selection
flatpickr("#date", {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  minDate: "today",
  defaultHour: 23,
  theme: "material_blue",
});

// Select necessary elements
const btn = document.querySelector(".cta-button");
const titleInput = document.getElementById("task-title");
const taskInput = document.getElementById("task");
const dateInput = document.getElementById("date");
const important = document.getElementById("important");
const planned = document.getElementById("planned");
const categoryButtons = document.querySelectorAll(".category .btn");
//state variables to check the state of application
let isImportant = false;
let isPlanned = false;
let selectedCategory = "";
let currentlyEditingTask = null; // Track the currently edited task

// Handle task type selection
important.addEventListener("click", () => setTaskType("important"));
planned.addEventListener("click", () => setTaskType("planned"));

// Handle category selection
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");
    selectedCategory = button.id;
  });
});

// Handle form submission
document.getElementById("task-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const titleValue = titleInput.value.trim();
  const taskValue = taskInput.value.trim();
  const dateValue = dateInput.value;

  // if (!taskValue && titleValue) {
  //   alert("Please enter a task!");
  //   return;
  // }

  if (btn.textContent === "Save Changes") {
    updateTask(titleValue, taskValue, dateValue);
  } else {
    addTask(titleValue, taskValue, dateValue);
  }

  resetForm(); // Ensure everything resets after submission
});

// Function to set task type
function setTaskType(type) {
  if (type === "important") {
    isImportant = true;
    isPlanned = false;
    important.style.backgroundColor = "#e63946";
    planned.style.backgroundColor = "#1d1f25";
  } else {
    isPlanned = true;
    isImportant = false;
    planned.style.backgroundColor = "#006494";
    important.style.backgroundColor = "#1d1f25";
  }
}

// Function to add a new task
function addTask(titleValue, taskValue, dateValue) {
  const taskItem = createTaskElement(titleValue, taskValue, dateValue);
  document.getElementById("task-list").appendChild(taskItem);
}

// Function to create a task element
function createTaskElement(titleValue, taskValue, dateValue) {
  const taskItem = document.createElement("div");
  taskItem.classList.add("task-item");

  if (isImportant) taskItem.classList.add("importantTask");
  if (isPlanned) taskItem.classList.add("plannedTask");

  const taskContent = `
    <div>
      ${
        isImportant
          ? `<i class="fa-solid fa-circle-exclamation" style="color: #e63946;"></i>`
          : ""
      }
      
      ${
        isPlanned
          ? `<i class="fa-solid fa-bookmark" style="color: #006494;"></i>`
          : ""
      }
      <span>${titleValue}</span>
    </div>
    <p>${taskValue}</p>
    <div id="dateText">
    ${
      dateValue
        ? `<i class="fa-solid fa-calendar" style="color: white;"></i>
        <span>${dateValue}</span>`
        : `<i class="fa-solid fa-calendar" style="color: white;"></i>
          <span></span>`
    }
    </div>
    <div class="category-container">
    ${
      selectedCategory
        ? `<span class="${selectedCategory}-text">#${selectedCategory}</span>`
        : `<span></span>`
    }
    </div>
    <div>
      <i class="fa-solid fa-pen-to-square edit-task" style="color: #0080ff;"></i>
      <i class="fa-solid fa-trash delete-task" style="color: #941b0c;"></i>
    </div>
  `;

  taskItem.innerHTML = taskContent;

  // Add event listeners
  taskItem
    .querySelector(".delete-task")
    .addEventListener("click", () => taskItem.remove());
  taskItem
    .querySelector(".edit-task")
    .addEventListener("click", () => editTask(taskItem));

  return taskItem;
}

// Function to edit a task
function editTask(taskItem) {
  // Reset border of previously edited task
  if (currentlyEditingTask) {
    currentlyEditingTask.style.border = "1px solid transparent";
  }
  let categoryValue = "";
  // Update input fields
  titleInput.value = taskItem.querySelector("span").textContent;
  taskInput.value = taskItem.querySelector("p").textContent;
  if (taskItem.querySelector("#dateText span").textContent) {
    dateInput.value = taskItem.querySelector("#dateText span").textContent;
  }
  if (taskItem.querySelector(".category-container span").textContent) {
    categoryValue = taskItem
      .querySelector(".category-container span")
      .textContent.replace("#", "");
    document.getElementById(categoryValue).classList.add("selected");
  }

  // Update task type states
  isImportant = taskItem.classList.contains("importantTask");
  isPlanned = taskItem.classList.contains("plannedTask");

  important.style.backgroundColor = isImportant ? "#e63946" : "#1d1f25";
  planned.style.backgroundColor = isPlanned ? "#006494" : "#1d1f25";

  // Highlight the currently edited task
  taskItem.style.border = "2px solid #0080ff"; // Blue border for edited task
  currentlyEditingTask = taskItem; // Track the task being edited

  btn.textContent = "Save Changes";
  console.log(`edit :${selectedCategory}`);
}

// Function to update a task
function updateTask(titleValue, taskValue, dateValue) {
  if (!currentlyEditingTask) return;

  // Update task content
  currentlyEditingTask.querySelector("span").textContent = titleValue;
  currentlyEditingTask.querySelector("p").textContent = taskValue;
  currentlyEditingTask.querySelector("#dateText span").textContent = dateValue;
  if (selectedCategory) {
    currentlyEditingTask.querySelector(".category-container span").textContent =
      "#" + selectedCategory;
    currentlyEditingTask.querySelector(".category-container span").className =
      "";
    console.log(`update: ${selectedCategory}`);
  }
  currentlyEditingTask
    .querySelector(".category-container span")
    .classList.add(`${selectedCategory}-text`);

  // Remove existing task type icons (if any)
  const existingIcons = currentlyEditingTask.querySelectorAll(
    ".fa-circle-exclamation, .fa-bookmark"
  );
  existingIcons.forEach((icon) => icon.remove());

  // Add new task type icons (if applicable)
  if (isImportant) {
    currentlyEditingTask.children[0].insertAdjacentHTML(
      "afterbegin",
      `<i class="fa-solid fa-circle-exclamation" style="color: #e63946;"></i>`
    );
  } else if (isPlanned) {
    currentlyEditingTask.children[0].insertAdjacentHTML(
      "afterbegin",
      `<i class="fa-solid fa-bookmark" style="color: #006494;"></i>`
    );
  }

  // Update task classes
  currentlyEditingTask.classList.toggle("importantTask", isImportant);
  currentlyEditingTask.classList.toggle("plannedTask", isPlanned);

  resetForm(); // Reset everything after saving
}

// Function to reset the form after adding or editing a task
function resetForm() {
  titleInput.value = "";
  taskInput.value = "";
  dateInput.value = "";
  important.style.backgroundColor = "#1d1f25";
  planned.style.backgroundColor = "#1d1f25";
  isImportant = false;
  isPlanned = false;
  categoryButtons.forEach((button) => {
    button.classList.remove("selected");
  });
  selectedCategory = "";

  // Reset border of edited task
  if (currentlyEditingTask) {
    currentlyEditingTask.style.border = "1px solid transparent";
  }
  currentlyEditingTask = null;

  btn.textContent = "Add Task";
}
