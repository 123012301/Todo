// let dark_mode = false
let list = document.getElementById("taskList");
let tasks = [];
let theme = "";
let checkbox_state = false;
let taskObj = [];
let showcompletedtasks = false;
const inputTask = document.querySelector(".taskkInput input");


let storage_tasks = localStorage.getItem("tasks");
const savedTheme = JSON.parse(localStorage.getItem("theme"));

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("color-mode").textContent = "🌙";
} else {
    document.body.classList.remove("dark-mode");
    document.getElementById("color-mode").textContent = "🌞";
}


if (storage_tasks !== null) {
    try {
        const parsed = JSON.parse(storage_tasks);
        if (Array.isArray(parsed)) {
            tasks = parsed;
            renderTasks()
        } else {
            console.warn("Local storage 'tasks' is not an array. Resetting it.");
            localStorage.removeItem("tasks");
        }
    } catch (error) {
        console.error("Failed to parse local storage 'tasks':", error);
        localStorage.removeItem("tasks");
    }
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Enter a valid value");
        return;
    }
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskInput.value = "";
    renderTasks();
}
inputTask.addEventListener("keydown", (event)=>{
    if (event.key == "Enter"){
        event.preventDefault();
        addTask()
    }
})

function showTasks(){
    let showcompleted_tasks = document.querySelector(".show_completed_tasks")
    if (showcompleted_tasks.checked){
       showcompletedtasks = true
    }
    else{
        showcompletedtasks = false 
    }
    renderTasks()
}

function renderTasks() {
    list.innerHTML = ""; // clear list before rendering
  
    
    tasks.forEach((taskText, index) => {
        if (taskText.completed && showcompletedtasks === false){
            return;
        }
        let newList = document.createElement("li");
        newList.className = "task-list";

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checkbox-list";
        // checkbox.checked = taskObj.completed;

        let taskList = document.createElement("span");
        taskList.className = "to-do-tasks";
        taskList.textContent = taskText.text;
        checkbox.checked = taskText.completed;
        if (taskText.completed) {
            taskList.classList.add("completed");
        }


        let deleteButton = document.createElement("button");
        deleteButton.className = "delete-text-button";
        deleteButton.textContent = "Delete";

        let editButton = document.createElement("button");
        editButton.className = "edit-button";
        editButton.textContent = "Edit";

        checkbox.addEventListener("change", () => {
            taskList.classList.toggle("completed");
            tasks[index].completed = checkbox.checked;
            tasks.sort((a, b) => {
                if (a.completed === b.completed) return 0;
                if (a.completed) return 1;
                return -1;
            })
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks()
        });


        deleteButton.addEventListener("click", () => {
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks(); // re-render list after deletion
        });

        editButton.addEventListener("click", () => {
            let edit_text = taskList.textContent
            console.log(edit_text)
            let input = document.createElement("input")
            input.type = "text"
            input.value = edit_text
            taskList.replaceWith(input)
            let save_button = document.createElement("button")
            save_button.className = "save-button"
            save_button.textContent = "Save"
            editButton.replaceWith(save_button)
            save_button.addEventListener("click", () => {
                if (input.value.trim() === "") {
                    alert("Cannot save an empty task")
                    return;
                }
                let edited_task = input.value;

                let new_edited_span = document.createElement("span");
                new_edited_span.className = "to-do-tasks";
                new_edited_span.textContent = edited_task;

                input.replaceWith(new_edited_span);
                save_button.replaceWith(editButton);

                taskList = new_edited_span;

             
                tasks[index].text = input.value;
           
                localStorage.setItem("tasks", JSON.stringify(tasks));
                renderTasks(); // re-render with updated value
           });
        });

        newList.appendChild(checkbox);
        newList.appendChild(taskList);
        newList.appendChild(deleteButton);
        newList.appendChild(editButton);
        list.appendChild(newList);
    });
}


function colorMode() {
    document.body.classList.toggle("dark-mode")
    // toggle mode adds the class if it is not present and removes it if it is
    //whereas .add doesnt do anything if it is present and if it isnt it jsut adds this class
    let dark_mode = document.body.classList.contains("dark-mode")
    console.log(dark_mode)

    if (dark_mode === true) {
        document.getElementById("color-mode").textContent = "🌙"
        theme = "dark"
    }
    else if (dark_mode === false) {
        document.getElementById("color-mode").textContent = "🌞"
        theme = "light"
    }
    localStorage.setItem("theme", JSON.stringify(theme))
}