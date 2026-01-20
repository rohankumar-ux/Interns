let todos = [];
let filter = "all";

// DOM Elements
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

function saveTodos(){
    localStorage.setItem("todos" , JSON.stringify(todos));
}

function loadTodos(){
    const saved = localStorage.getItem("todos");
    if(saved){
        todos = JSON.parse(saved);
    }
}
function writeTodos() {
    let filteredTodos = getFilteredTodos();

    if (filteredTodos.length === 0) {
        todoList.innerHTML = `<div>No todos to show.</div>`;
        return;
    }

    const todosHTML = filteredTodos.map(
        (item) =>
            `<li class="${item.completed ? "completed" : ""}"><input type='checkbox' onclick="checkItem(${item.id})"/><span>${item.text}<span> <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>`,
    );
    todoList.innerHTML = todosHTML;
}

function setFilter(todoFilter) {
    filter = todoFilter;
    writeTodos();
}

function getFilteredTodos() {
    if (filter === "active") {
        return todos.filter((todo) => !todo.completed);
    }
    if (filter === "completed") {
        return todos.filter((todo) => todo.completed);
    }
    return todos;
}

function deleteItem(id) {
    todos = todos.filter((item) => item.id !== id);
    saveTodos();
    writeTodos();
}

function checkItem(id) {
    const todoslistMap = todos.find((item) => item.id === id);

    if (todoslistMap) {
        todoslistMap.completed = !todoslistMap.completed;
    }
    saveTodos();
    writeTodos();
}

todoForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const text = todoInput.value.trim();
    todoInput.value = "";
    todos.unshift({
        id: Date.now(),
        text: text,
        completed: false,
    });
    saveTodos();
    writeTodos();
    console.log(todos);
});

const themeButton = document.getElementById("theme-toggle");
console.log("themeButton", themeButton);

themeButton.addEventListener("click", () => {
    document.body.classList.toggle('dark-mode');
    themeButton.textContent = (themeButton.textContent === '☀️' ? '🌙' : '☀️');
})

window.addEventListener("DOMContentLoaded", () => {
    loadTodos();
    writeTodos();
});