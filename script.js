document.addEventListener("DOMContentLoaded", loadTasks);
document.getElementById("addTaskBtn").addEventListener("click", addTask);
document.getElementById("sortTasksBtn").addEventListener("click", sortTasks);
document.getElementById("darkModeToggle").addEventListener("click", toggleDarkMode);

let totalTasks = 0;
let completedTasks = 0;

function updateProgress() {
  document.getElementById("completedCount").innerText = completedTasks;
  document.getElementById("totalCount").innerText = totalTasks;
}

function addTask() {
  const taskInput = document.getElementById("taskInput").value.trim();
  const priority = document.getElementById("priority").value;
  const deadline = document.getElementById("deadline").value;

  if (taskInput === "" || deadline === "") {
    alert("Please fill in all fields.");
    return;
  }

  const task = {
    id: Date.now(),
    description: taskInput,
    priority,
    deadline,
    status: "Not Started"
  };

  saveTask(task);
  renderTask(task);
  totalTasks++;
  updateProgress();
  clearForm();
}

function clearForm() {
  document.getElementById("taskInput").value = "";
  document.getElementById("deadline").value = "";
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(renderTask);
  totalTasks = tasks.length;
  completedTasks = tasks.filter(task => task.status === "Completed").length;
  updateProgress();
}

function renderTask(task) {
  const taskList = document.getElementById("taskList");
  const row = document.createElement("tr");

  row.dataset.id = task.id;
  row.innerHTML = `
    <td>${task.description}</td>
    <td>${task.deadline}</td>
    <td>${task.priority}</td>
    <td>${task.status}</td>
    <td class="actions">
      <button class="complete" onclick="markComplete(this)">Complete</button>
      <button class="delete" onclick="deleteTask(this)">Delete</button>
    </td>
  `;

  if (task.status === "Completed") {
    row.querySelector(".complete").disabled = true;
  }

  taskList.appendChild(row);
}

function markComplete(button) {
  const row = button.parentElement.parentElement;
  const id = row.dataset.id;

  const tasks = JSON.parse(localStorage.getItem("tasks"));
  const task = tasks.find(t => t.id === parseInt(id));
  task.status = "Completed";
  localStorage.setItem("tasks", JSON.stringify(tasks));

  row.cells[3].innerText = "Completed";
  button.disabled = true;

  completedTasks++;
  updateProgress();
}

function deleteTask(button) {
  const row = button.parentElement.parentElement;
  const id = row.dataset.id;

  const tasks = JSON.parse(localStorage.getItem("tasks")).filter(t => t.id !== parseInt(id));
  localStorage.setItem("tasks", JSON.stringify(tasks));

  const status = row.cells[3].innerText;
  if (status === "Completed") completedTasks--;
  totalTasks--;
  row.remove();
  updateProgress();
}

function sortTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.sort((a, b) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById("taskList").innerHTML = "";
  tasks.forEach(renderTask);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
}