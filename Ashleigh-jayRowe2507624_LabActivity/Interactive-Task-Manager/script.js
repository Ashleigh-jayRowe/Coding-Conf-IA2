/* Student: Ashleigh-jay Rowe | Student ID: 2507624
   Module: CIT2011 | Assignment: Week 8 - Interactive Task Manager */


var tasks = [];
var currentFilter = "all";
var editingTaskId = null;

var taskForm = document.getElementById("taskForm");
var taskInput = document.getElementById("taskInput");
var priorityInput = document.getElementById("priorityInput");
var taskList = document.getElementById("taskList");
var emptyState = document.getElementById("emptyState");
var formMessage = document.getElementById("formMessage");
var submitButton = document.getElementById("submitButton");
var formHeading = document.getElementById("formHeading");

/* Load previously saved tasks from local storage. */
function loadTasks() {
    var savedTasks = localStorage.getItem("interactiveTasks");

    if (savedTasks !== null) {
        try {
            tasks = JSON.parse(savedTasks);
            if (!Array.isArray(tasks)) {
                tasks = [];
            }
        } catch (error) {
            tasks = [];
            formMessage.textContent = "Saved tasks could not be loaded. You can start a new list.";
        }
    }
}

/* Save the task array as a JSON string. */
function saveTasks() {
    localStorage.setItem("interactiveTasks", JSON.stringify(tasks));
}

/* Display the current date in the page header. */
function showDate() {
    var today = new Date();
    document.getElementById("todayDate").textContent =
        today.toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" });
}

/* Update the task totals. */
function updateSummary() {
    var completed = 0;
    var i;

    for (i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            completed++;
        }
    }

    document.getElementById("totalCount").textContent = tasks.length;
    document.getElementById("completedCount").textContent = completed;
    document.getElementById("activeCount").textContent = tasks.length - completed;
}

/* Create and display the task list using DOM elements. */
function displayTasks() {
    taskList.innerHTML = "";
    var visibleCount = 0;
    var i;

    for (i = 0; i < tasks.length; i++) {
        var task = tasks[i];

        if (currentFilter === "active" && task.completed) {
            continue;
        }
        if (currentFilter === "completed" && !task.completed) {
            continue;
        }

        visibleCount++;

        var item = document.createElement("li");
        item.className = "task-item";
        if (task.completed) {
            item.classList.add("completed");
        }

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark " + task.title + " as complete");
        checkbox.addEventListener("change", createToggleHandler(task.id));

        var details = document.createElement("div");
        details.className = "task-details";

        var title = document.createElement("span");
        title.className = "task-title";
        title.textContent = task.title;

        var meta = document.createElement("div");
        meta.className = "task-meta";

        var priority = document.createElement("span");
        priority.className = "priority priority-" + task.priority.toLowerCase();
        priority.textContent = task.priority + " priority";

        meta.appendChild(priority);
        details.appendChild(title);
        details.appendChild(meta);

        var actions = document.createElement("div");
        actions.className = "task-actions";

        var editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "action-button";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", createEditHandler(task.id));

        var deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "action-button delete";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", createDeleteHandler(task.id));

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        item.appendChild(checkbox);
        item.appendChild(details);
        item.appendChild(actions);
        taskList.appendChild(item);
    }

    emptyState.style.display = visibleCount === 0 ? "block" : "none";
    updateSummary();
}

/* Return event handler functions for the selected task. */
function createToggleHandler(id) {
    return function () {
        toggleTask(id);
    };
}

function createEditHandler(id) {
    return function () {
        editTask(id);
    };
}

function createDeleteHandler(id) {
    return function () {
        deleteTask(id);
    };
}

/* Add a new task or save changes to an existing task. */
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var title = taskInput.value.trim();
    var priority = priorityInput.value;

    if (title === "") {
        formMessage.textContent = "Please enter a task description.";
        taskInput.focus();
        return;
    }

    if (editingTaskId !== null) {
        var i;
        for (i = 0; i < tasks.length; i++) {
            if (tasks[i].id === editingTaskId) {
                tasks[i].title = title;
                tasks[i].priority = priority;
                break;
            }
        }
        formMessage.textContent = "Task updated successfully.";
        editingTaskId = null;
        formHeading.textContent = "Add a task";
        submitButton.textContent = "Add task";
    } else {
        var newTask = {
            id: Date.now(),
            title: title,
            priority: priority,
            completed: false
        };
        tasks.push(newTask);
        formMessage.textContent = "Task added successfully.";
    }

    saveTasks();
    displayTasks();
    taskForm.reset();
    priorityInput.value = "Medium";
});

/* Place a task's details back into the form so it can be changed. */
function editTask(id) {
    var i;
    for (i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            taskInput.value = tasks[i].title;
            priorityInput.value = tasks[i].priority;
            editingTaskId = id;
            formHeading.textContent = "Update task";
            submitButton.textContent = "Save changes";
            formMessage.textContent = "Make your changes, then select Save changes.";
            taskInput.focus();
            break;
        }
    }
}

/* Change a task between complete and incomplete. */
function toggleTask(id) {
    var i;
    for (i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].completed = !tasks[i].completed;
            break;
        }
    }
    saveTasks();
    displayTasks();
}

/* Remove a task from the array. */
function deleteTask(id) {
    var i;
    for (i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks.splice(i, 1);
            break;
        }
    }

    if (editingTaskId === id) {
        cancelEdit();
    }
    saveTasks();
    displayTasks();
    formMessage.textContent = "Task deleted.";
}

/* Reset the form if the user changes their mind while editing. */
function cancelEdit() {
    editingTaskId = null;
    taskForm.reset();
    formHeading.textContent = "Add a task";
    submitButton.textContent = "Add task";
}

/* Filter buttons display all, active or completed tasks. */
var filterButtons = document.querySelectorAll(".filter-button");
var buttonIndex;

for (buttonIndex = 0; buttonIndex < filterButtons.length; buttonIndex++) {
    filterButtons[buttonIndex].addEventListener("click", function () {
        var i;
        for (i = 0; i < filterButtons.length; i++) {
            filterButtons[i].classList.remove("active");
        }
        this.classList.add("active");
        currentFilter = this.getAttribute("data-filter");
        displayTasks();
    });
}

/* Start the application. */
loadTasks();
showDate();
displayTasks();
