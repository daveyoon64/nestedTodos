'use strict';

var ENTER_KEY = 13;
var ESCAPE_KEY = 27;
var filter = "";
var todos = store('todos-jquery');
var todoTemplateEl = document.getElementById('todo-template');
var footerTemplateEl = document.getElementById('footer-template');

//
// utility functions
// 
function uuid() {
  /* jshint bitwise:false */
  var i, random;
  var uuid = '';

  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    // not quite sure how this works. I'll step through later...
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
  }
  return uuid;
}  
function store(namespace, data) {
  if (arguments.length > 1) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  } else {
    var store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }
}
function pluralize(count, word) {
  return count === 1 ? word : word + 's';
}

// global Handlebars, Router
//
// App functions
// 
function init() {
  bindEvents();
  new Router({
    '/:filter': function (DOMfilter) {
      filter = DOMfilter;
      render();
    }.bind(this)
  }).init('/all');   
}
function bindEvents() {
  var newTodoEvent = document.getElementById('new-todo');
  var toggleAllEvent = document.getElementById('toggle-all');
  var footerEvent = document.getElementById('footer');
  var todoListEvent = document.getElementById('todo-list');

  newTodoEvent.addEventListener('keyup', function(event) {
    create(event);
  });
  toggleAllEvent.addEventListener('change', function(event) {
    toggleAll(event);
  });
  footerEvent.addEventListener('click', function(event) {
    if (event.target && event.target.id === "clear-completed") {
      destroyCompleted(event);  
    }
  });
  todoListEvent.addEventListener('change', function(event) {
    if (event.target && event.target.className === 'toggle') {
      toggle(event);
    }
  });
  todoListEvent.addEventListener('dblclick', function(event) {
    if (event.target && event.target.tagName === 'LABEL') {
      edit(event);
    }
  });
  todoListEvent.addEventListener('keyup', function(event) {
    if (event.target && event.target.className === 'edit') {
      editKeyup(event);
    }
  });
  todoListEvent.addEventListener('focusout', function(event) {
    if (event.target && event.target.className === 'edit') {
      update(event);
    }
  });
  todoListEvent.addEventListener('click', function(event) {
    if (event.target && event.target.className === 'destroy') {
      destroy(event);
    }
  });
}
function render() {
  var todos = getFilteredTodos();
  var todoList = document.getElementById('todo-list');
  var main = document.getElementById('main');
  var toggleAll = document.getElementById('toggle-all');
  var newTodo = document.getElementById('new-todo');
  

  var todoHTMLTemplate = "";
  todos.forEach((todo) => {
    var tempString = `
      <li ${todo.completed ? `class="completed"` : ``}data-id="${todo.id}">
        <div class="view">
          <input class="toggle" type="checkbox" ${todo.completed ? `checked` : ``}>
          <label>${todo.title}</label>
          <button class="destroy"></button>
        </div>
        <input class="edit" value="${todo.title}">
      </li>
    `;
    todoHTMLTemplate += tempString;
  });
  todoList.innerHTML = todoHTMLTemplate;
  
  main.style.display = todos.length > 0 ? 'inline' : 'none';
  toggleAll.checked = getActiveTodos().length === 0 ? true : false;
  renderFooter();
  newTodo.focus()

  store('todos-jquery', todos);
}
function renderFooter() {
  var footer = document.getElementById('footer');
  var todoCount = todos.length;
  var activeTodoCount = getActiveTodos().length;
  var activeTodoWord = pluralize(activeTodoCount, 'item');
  var completedTodos = todoCount - activeTodoCount;
  
  var template = `
    <span id="todo-count"><strong>${activeTodoCount}</strong> ${activeTodoWord} left</span>
    <ul id="filters">
      <li>
        ${checkFilter('all') ? `<a class="selected" href="#/all">All</a>` : `<a href="#/all">All</a>`}
      </li>
      <li>
        ${checkFilter('active') ? `<a class="selected" href="#/active">Active</a>` : `<a href="#/active">Active</a>`}
      </li>
      <li>
        ${checkFilter('completed') ? `<a class="selected" href="#/completed">Completed</a>` : `<a href="#/completed">Completed</a>`}
      </li>
    </ul>
    ${completedTodos ? `<button id="clear-completed">Clear completed</button>` : ''}
  `;
  
  footer.style.display = todoCount > 0 ? 'block' : 'none';
  footer.innerHTML = template;
}
function checkFilter(testFilter) {
  return testFilter === filter;
}
function toggleAll(e) {
  var isChecked = e.target.checked;
  todos.forEach(function (todo) {
    todo.completed = isChecked;
  });

  render();
}
function getActiveTodos() {
  return todos.filter(function (todo) {
    return !todo.completed;
  });
}
function getCompletedTodos() {
  return todos.filter(function (todo) {
    return todo.completed;
  });
}
function getFilteredTodos() {
  if (filter === 'active') {
    return getActiveTodos();
  }

  if (filter === 'completed') {
    return getCompletedTodos();
  }

  return todos;
}
function destroyCompleted() {
  todos = getActiveTodos();
  filter = 'all';
  render();
}
function create(e) {
  var input = e.target;
  var val = input.value.trim();

  if (e.which !== ENTER_KEY || !val) {
    return;
  }

  todos.push({
    id: uuid(),
    title: val,
    completed: false
  });
  // set input box to blank
  input.value = '';
  render();
}
function toggle(e) {
  var i = indexFromEl(e.target);
  todos[i].completed = !todos[i].completed;
  render();
}
function edit(e) {
  var el = e.target.closest('li');
  el.classList.add('editing');
  var input = el.querySelector('.edit');
  input.focus();
}
function editKeyup(e) {
  if (e.which === ENTER_KEY) {
    e.target.blur();
  }

  if (e.which === ESCAPE_KEY) {
    e.target.dataset.abort = true;
    e.target.blur();
  }
}
function update(e) {
  var el = e.target;
  var val = el.value.trim();

  if (!val) {
    this.destroy(e);
    return;
  }

  if (el.dataset.abort) {
    el.dataset.abord = false;
  } else {
    todos[indexFromEl(el)].title = val;
  }

  render();
}
// accepts an element from inside the `.item` div and
// returns the corresponding index in the `todos` array
function indexFromEl(el) {
  var id = el.closest('li').dataset.id;
  var i = todos.length;

  while (i--) {
    if (todos[i].id === id) {
      return i;
    }
  }
}
function destroy(e) {
  todos.splice(indexFromEl(e.target), 1);
  render();
}

init();