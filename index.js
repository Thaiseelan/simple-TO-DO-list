// Initialize the task array
let tasks = [];

// Function to save tasks to localStorage
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));

    if (storedTasks) {
        tasks = storedTasks;  // Load stored tasks into the tasks array
        updateTasksList();
        updateStats();
    }
});

// Add a new task
const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({ text: text, completed: false });
        taskInput.value = "";  // Clear input field
        updateTasksList();
        updateStats();
        saveTasks();  // Save updated task list
    }
};

// Toggle task completion
const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
    saveTasks();
};

// Delete a task
const deleteTask = (index) => {
    tasks.splice(index, 1);  // Remove task from the array
    updateTasksList();
    updateStats();
    saveTasks();
};

// Edit a task (modify the text and update in place)
const editTask = (index) => {
    const taskInput = document.getElementById("taskInput");
    taskInput.value = tasks[index].text;  // Set input to current task's text

    // Temporarily change the newTask button to save edits instead of adding a new task
    const saveEdit = () => {
        const newText = taskInput.value.trim();
        if (newText) {
            tasks[index].text = newText;  // Update task text at the same index
            taskInput.value = "";  // Clear input field
            updateTasksList();
            updateStats();
            saveTasks();

            // Restore original 'addTask' functionality
            document.getElementById('newTask').removeEventListener('click', saveEdit);
            document.getElementById('newTask').addEventListener('click', handleAddTask);
        }
    };

    // Change the button to handle saving the edit
    document.getElementById('newTask').removeEventListener('click', handleAddTask);
    document.getElementById('newTask').addEventListener('click', saveEdit);
};

// Update the progress and statistics
const updateStats = () => {
    const completeTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks === 0 ? 0 : (completeTasks / totalTasks) * 100;
    const progressBar = document.getElementById("progress");

    progressBar.style.width = `${progress}%`;
    document.getElementById('numbers').innerText = `${completeTasks} / ${totalTasks}`;

    if (tasks.length && completeTasks === totalTasks) {
        blastConfetti();
    }
};

// Update the task list UI
const updateTasksList = () => {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = '';  // Clear current task list

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? "completed" : ""}">
                    <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} />
                    <p>${task.text}</p>
                </div>
                <div class="icons">
                    <img src="./img/edit.jpeg" onclick="editTask(${index})" />
                    <img src="./img/bin.png" onclick="deleteTask(${index})" />
                </div>
            </div>
        `;

        // Toggle task completion when checkbox is clicked
        listItem.querySelector('.checkbox').addEventListener('change', () => toggleTaskComplete(index));

        taskList.append(listItem);  // Append the task to the list
    });
};

// Event handler for adding a new task
const handleAddTask = (e) => {
    e.preventDefault();  // Prevent form from submitting
    addTask();
};

// Confetti blast when all tasks are completed
const blastConfetti = () => {
    const duration = 15 * 1000,
        animationEnd = Date.now() + duration,
        defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
    }, 250);
};

// Attach event listener to the addTask button
document.getElementById('newTask').addEventListener('click', handleAddTask);
