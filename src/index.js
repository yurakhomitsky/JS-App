/* eslint-disable no-unused-vars */
import '../assets/css/style.css';

const app = document.getElementById('app');

app.innerHTML = `
    <div class="todos">
        <div class="todos-header">
            <h3 class="todos-title">Todo List</h3>
            <div>
                <p>You have <span class="todos-count"></span> items</p>
                <button type="button" class="todos-clear" style="display:none">
                    Clear Completed
                </button>
            </div>
        </div>
   
    <form class="todos-form" name="todos">
    <input type="text" placeholder="What's next?" name="todo">
    </form>
    <ul class="todos-list"></ul>
    </div>
`;

// state

let todos = JSON.parse(localStorage.getItem('todos')) || [];

// selectors

const root = document.querySelector('.todos');
const list = root.querySelector('.todos-list');
const count = root.querySelector('.todos-count');
const clear = root.querySelector('.todos-clear');
const form = document.forms.todos;
const input = form.elements.todo;

function saveToStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos(location, todos) {
    const items = todos.map((todo, index) => {
        return `
        <li data-id="${index}"${
            todo.completed ? ' class="todos-complete"' : ''
        }>
            <input type="checkbox"${todo.completed ? ' checked' : ''}>
            <span>${todo.label}</span>
            <button type="button"></button>
        </li>
        `;
    });
    location.innerHTML = items.join('');
    count.innerHTML = todos.filter((todo) => !todo.completed).length;
    clear.style.display = todos.filter((todo) => todo.completed).length
        ? 'block'
        : 'none';
    saveToStorage(todos);
}

function addTodo(event) {
    event.preventDefault();
    const label = input.value.trim();
    const completed = false;
    const newTask = {
        label,
        completed,
    };
    todos = create(todos, newTask);
    input.value = '';
    renderTodos(list, todos);
}
function updateTodo(event) {
    const id = +event.target.parentNode.dataset.id;
    const completed = event.target.checked;
    todos = update(todos, id, {
        completed,
    });
    renderTodos(list, todos);
}
function editTodo(event) {
    if (event.target.nodeName.toLowerCase() !== 'span') {
        return;
    }
    const id = +event.target.parentNode.dataset.id;
    const todoLabel = todos[id].label;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = todoLabel;

    event.target.style.display = 'none';
    event.target.parentNode.append(input);

    input.addEventListener('change', handleEdit);
    input.focus();

    function handleEdit(event) {
        event.stopPropagation();
        const label = this.value;
        if (label !== todoLabel) {
            todos = update(todos, id, {
                label,
            });
            renderTodos(list, todos);
        }
        event.target.style.display = '';
        this.removeEventListener('change', handleEdit);
        this.remove();
    }
}
function deleteTodo(event) {
    if (event.target.type === 'button') {
        const id = +event.target.parentNode.dataset.id;
        todos = remove(todos, id);
        renderTodos(list, todos);
    }
}
function clearCompleteTodos(event) {
    const count = todos.filter((todo) => todo.completed).length;
    if (count === 0) {
        return;
    }
    if (window.confirm(`Delete ${count} todos?`)) {
        todos = todos.filter((todo) => !todo.completed);
        renderTodos(list, todos);
    }
}
function init() {
    renderTodos(list, todos);
    // add Todo
    form.addEventListener('submit', addTodo);
    // update todo
    list.addEventListener('change', updateTodo);

    // edit Todo
    list.addEventListener('dblclick', editTodo);

    // delete todo
    list.addEventListener('click', deleteTodo);
    // clear all complete todos
    clear.addEventListener('click', clearCompleteTodos);
}

init();

function create(array, item) {
    return [...array, item];
}
function update(array, id, body) {
    return array.map((todo, index) => {
        if (index === id) {
            return {
                ...todo,
                ...body,
            };
        }
        return todo;
    });
}
function remove(array, id) {
    return array.filter((todo, index) => {
        return index !== id;
    });
}
