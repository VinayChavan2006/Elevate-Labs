// store tasks in local storage
// localStorage.clear();
let tasks = JSON.parse(localStorage.getItem("tasks-list")) || [];

// function to save tasks to local storage
function saveTasks() {
  localStorage.setItem("tasks-list", JSON.stringify(tasks));
}

let addBtn = document.getElementById("add-btn");
let todoInput = document.getElementById("task-name");
let list = document.getElementsByTagName("ul")[0];

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const taskValue = todoInput.value.trim();
  if (taskValue === "") {
    alert("Please enter a task");
    return;
  }
  tasks.push(taskValue);
  saveTasks();
  addTaskToDOM(taskValue);
  if (todoInput.value.trim() === "") {
    alert("Please enter a task");
    return;
  }
  todoInput.value = "";
});

//add task to the DOM
const addTaskToDOM = (task) => {
  let listItem = document.createElement("li");

  listItem.innerHTML += `<div class="label-check">
              <div class="check" id="check1">
                <input type="checkbox" name="task1" id="1" />
              </div>
              <label for="1">${task}</label>
            </div>
            <div>
              <i class="fa-solid fa-trash"></i>
            </div>`;
  list.appendChild(listItem);

  let deleteBtn = listItem.querySelector(".fa-trash");
  deleteBtn.addEventListener("click", () => {
    deleteTask(listItem);
  });
  let checkBox = listItem.querySelector("input");
  let labelText = listItem.querySelector("label");
  checkBox.addEventListener("change", () => {
    console.log("check: ", checkBox.checked);
    if (checkBox.checked) {
      labelText.style.textDecoration = "line-through";
    } else {
      labelText.style.textDecoration = "none";
    }
  });
};

// function to load tasks from local storage
function loadTasks() {
  tasks.forEach((task) => {
    // confirm(`Task: ${task}`);
    addTaskToDOM(task);
  });
}
// load tasks when the page loads
loadTasks();

// on reload, load tasks from local storage
window.addEventListener("load", () => {
  list.innerHTML = ""; // Clear the list to avoid duplicates
  loadTasks();
});

function deleteTask(taskItem) {
  tasks = tasks.filter(
    (task) => task !== taskItem.querySelector("label").textContent
  );
  saveTasks();
  taskItem.remove();
}
