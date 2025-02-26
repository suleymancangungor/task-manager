let tasks = [];

const form = document.querySelector("#taskAddForm");

form.addEventListener("submit", addTask);
document.addEventListener("DOMContentLoaded", loadList);

function loadList(){
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    tasks = storedTasks.map(task => new Task(task.text, task.priority));
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
        let newTask = new Task(value);
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
        prioritySelect.value = task.priority;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("task-checkbox");
        checkbox.checked = task.completed;

        const span = document.createElement("span");
        span.textContent = task.text;
        span.classList.add("task-text");
       
        const editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.textContent = "Edit";
        
        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-button");
        removeButton.textContent = "x";

        prioritySelect.addEventListener("change", (e) => {
            task.changePriority(e.target.value);
            prioritySelect.value = task.priority;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            reorderTasks();
        })

        checkbox.addEventListener("change", (e)=>{
            task.toggleCompletion();
            localStorage.setItem("tasks", JSON.stringify(tasks));
            span.style.textDecoration = task.completed ? "line-through" : "none";
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
                let existing = false;
                for (let i = 0; i < tasks.length; i++){
                    if (tasks[i].text.trim().toLowerCase() === task.text.trim().toLowerCase()){
                        existing = true;
                    }
                }
                if (updatedTask != null && updatedTask !== "" && !existing){
                    task.updateText(updatedTask);
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                } else if (existing){
                   alert("Task already exists!");
                    span.textContent = task.text; 
                } else {
                    alert("Task cannot be empty!");
                    span.textContent = task.text;
                }
            }
        });

        removeButton.addEventListener("click", (e) => {
            tasks= tasks.filter(t=> t.text.toLowerCase() !== task.text.toLowerCase());
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
        const priorities = {"low": 1, "medium": 2, "high": 3};
        return priorities[b.priority] - priorities[a.priority];
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
    constructor(text){
        this.text = text;
        this.priority = "low"
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
