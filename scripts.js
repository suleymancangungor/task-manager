//! I was changing tasks format from only text to the class object. Not finished yet!


let tasks = [];

const form = document.querySelector("#taskAddForm");

form.addEventListener("submit", addTask);
document.addEventListener("DOMContentLoaded", loadList);

function loadList(){
    tasks = JSON.parse(localStorage.getItem("tasks"));
    listTasks(tasks);
}

function addTask(e){
    e.preventDefault();

    const input = document.querySelector("#taskName");
    const value = input.value.trim();
    if (value !== ""){
        const taskExist = tasks.some(task=>task.text.toLowerCase() === value.toLowerCase());
        if (taskExist){
            showAddAlert("warning");
            return;
        }
        let newTask = new Task(value, 0);
        tasks.push(newTask);
        input.value = "";
        listTasks(tasks);
        localStorage.setItem("tasks",JSON.stringify(tasks));

        showAddAlert("success");
        return;
    }
    showAddAlert("fail");
}

const searchForm = document.querySelector("#taskSearchForm");

searchForm.addEventListener("keyup", findTask);

function findTask(e){
    e.preventDefault();

    const input = document.querySelector("#taskSearch");
    const value = input.value.trim().toLowerCase();
    if (value !== ""){
        const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(value));
        listTasks(filteredTasks);
    } else {
        listTasks(tasks);
    }
}

function listTasks(list){
    const taskList = document.querySelector(".task-list");
    taskList.innerHTML = "";
    list.forEach((task) => {
        const li = document.createElement("li");
        li.classList.add("task-item");

        const prioritySelect = document.createElement("select");
        const lowOption = document.createElement("option");
        lowOption.value = "low";
        lowOption.textContent = "Low";
        const mediumOption = document.createElement("option");
        mediumOption.value = "medium";
        mediumOption.textContent = "Medium";
        const highOption = document.createElement("option");
        highOption.value = "high";
        highOption.textContent = "High";
        prioritySelect.appendChild(lowOption);
        prioritySelect.appendChild(mediumOption);
        prioritySelect.appendChild(highOption);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("task-checkbox");
        
        const span = document.createElement("span");
        span.textContent = task.text;
        span.classList.add("task-text");
       
        const editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.textContent = "Edit";
        
        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-button");
        removeButton.textContent = "X";

        prioritySelect.addEventListener("change", (e) => {
            reorderTasks();
        })

        checkbox.addEventListener("change", (e)=>{
            if (e.target.checked) {
                span.style.textDecoration = "line-through";
            } else {
                span.style.textDecoration = "none";
            }
        });

        editButton.addEventListener("click", (e) => {
            const isEditable = span.getAttribute("contenteditable") === "true";
            span.contentEditable = !isEditable;

            if (span.contentEditable === "true"){
                span.focus();
                e.target.textContent = "Save";
            } else {
                e.target.textContent = "Edit";
                const updatedTask = span.textContent.trim();
                if (updatedTask != null && updatedTask !== ""){
                    const taskIndex = tasks.indexOf(task);
                    tasks[taskIndex] = updatedTask;
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                } else {
                    alert("Task cannot be empty!");
                    span.textContent = task;
                }
            }
        });

        removeButton.addEventListener("click", (e) => {
            tasks= tasks.filter(t=> t.toLowerCase() !== task);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            listTasks(tasks);
            document.querySelector("#taskSearch").value = "";
        });
        li.appendChild(prioritySelect);
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editButton);
        li.appendChild(removeButton);
        taskList.appendChild(li);
    });
}

function reorderTasks(){
    tasks.sort((a,b) => {
        const priorityA = a.querySelector("select").value;
        const priorityB = b.querySelector("select").value;
        const priorities = {"low" : 1, "medium": 2, "high" :3};
        return priorities[priorityB] - priorities[priorityA];
    });
    listTasks(tasks);
}

const clearTasksForm = document.querySelector("#clearTasksForm");

clearTasksForm.addEventListener("reset", clearTasks);

function clearTasks(e){
    e.preventDefault();
    tasks = [];
    localStorage.setItem("tasks",JSON.stringify(tasks));
    listTasks(tasks);
    alert("All tasks have been removed!");
    document.querySelector("#taskSearch").value = "";
}

function showAddAlert(e){
    const div = document.createElement("div");
    const p = document.createElement("p");
    div.classList.add("alert");
    if (e==="success"){
        div.classList.add("alert-success");
        p.textContent = "Task has been successfully added!";
    } else if (e==="warning"){
        div.classList.add("alert-warning");
        p.textContent = "Task has been already added!";
    } else {
        div.classList.add("alert-fail");
        p.textContent = "Task is not valid!";
    }
    div.appendChild(p);
    const addCardBody = document.querySelectorAll(".card-body")[0];
    addCardBody.appendChild(div);
    setTimeout(function(){
        hideAddAlert();
    },2000);
}

function hideAddAlert(){
    const alert = document.querySelector(".alert");
    alert.remove();
}


class Task{
    constructor(text, priority){
        this.text = text;
        this.priority = priority;
        this.completed = false;
    }

    toggleCompletion() {
        this.completed = !this.completed;
    }

    changePriority(newPriority) {
        this.priority = newPriority;
    }

    updateText(newText) {
        this.text = newText;
    }
}