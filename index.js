const listContainer = document.getElementById("listContainer");
const addBtn = document.querySelector(".addTastBtn");
const numberOfTasks = document.querySelector(".taskCount span");
const completedTasks = document.querySelector(".taskCompleted span");
const clearAllCompletedTasks = document.querySelector(".clearCompletedTasks");

function addTask() {
  const inputVaue = input.value;

  const prioritySelect = document.getElementById("prioritySelect");
  const priorityValue = prioritySelect.value;
  const dueDateInput = document.getElementById("dueDateInput");
  const dueDateValue = dueDateInput.value;

  if (inputVaue.trim() !== "") {
    const listItem = document.createElement("li");
    listItem.textContent = ` ${inputVaue}  (Due: ${dueDateValue})`;
    listItem.classList.add(priorityValue);
    listItem.classList.add("draggable");

    // store date
    listItem.setAttribute("data-due-date", dueDateValue);
    listContainer.appendChild(listItem);

    // Set Dates lol
    const currentDate = new Date();
    const dueDate = new Date(dueDateValue);

    const daysRemaining = Math.ceil(
      (dueDate - currentDate) / (1000 * 60 * 60 * 24)
    );
    if (daysRemaining < 0) {
      listItem.textContent = `${inputVaue} \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0  (Overdue by ${Math.abs(
        daysRemaining
      )} days)`;
    } else if (daysRemaining === 0) {
      listItem.textContent = `${inputVaue} \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 (Due today)`;
    } else {
      listItem.textContent = `${inputVaue} \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 (Due in ${daysRemaining} days)`;
    }

    const span = document.createElement("span");
    span.innerHTML = "\u00d7";
    listItem.appendChild(span);
    numberOfTasks.textContent = listItem.length;
  } else {
    alert("Write something brah");
  }
  input.value = "";
  dueDateInput.value = "";
  saveData();
}

addBtn.addEventListener("click", () => {
  addTask();
  updateTaskCount();
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
    updateTaskCount();
  }
});

// function to check and remove a list item

listContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    updateTaskCount();
    saveData();
  } else if (e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
    saveData();
    updateTaskCount();
  }
});
// function to save data to local storage
function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
  localStorage.setItem("TaskCount", listContainer.childElementCount);
  localStorage.setItem(
    "CompletedTasks",
    document.getElementsByClassName("checked").length
  );
}
// function to diisplay data from local storage
function displayData() {
  listContainer.innerHTML = localStorage.getItem("data");
  let totalTasks = localStorage.getItem("TaskCount") || 0;
  let CompTasks = localStorage.getItem("CompletedTasks") || 0;

  numberOfTasks.textContent = totalTasks;
  completedTasks.textContent = CompTasks;
}

displayData();

// function to display task count
function updateTaskCount() {
  let totalTasks = listContainer.childElementCount;
  numberOfTasks.textContent = totalTasks;
  let completedTasksLength = document.getElementsByClassName("checked").length;
  completedTasks.textContent = completedTasksLength;
}

function clearCompletedTasks() {
  const completedTasks = document.querySelectorAll(".checked");
  completedTasks.forEach((task) => {
    task.remove();
  });
  updateTaskCount();
  saveData();
}

clearAllCompletedTasks.addEventListener("click", clearCompletedTasks);

document.addEventListener("DOMContentLoaded", function () {
  const sortable = new Draggable.Sortable(listContainer, {
    draggable: ".draggable",
    mirror: {
      constrainDimensions: true,
    },
  });
  sortable.on("sortable:stop", () => {
    updateTaskCount();
  });
});
