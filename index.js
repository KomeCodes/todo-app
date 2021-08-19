//   Selectors
const todoInputEl = document.querySelector(".create-todo-field");
const todoList = document.querySelector("#todoslist");
const todoForm = document.querySelector("#todo-form");
const sortTodo = document.querySelector(".todo-sort");
const clearCompletedTodoBtn = document.querySelector(".clear-completed-btn");
const activeTodosCounter = document.querySelector("#active-todo-counter");

// Arrays

let todos = [];
let completedTodos = [];

// LOCAL STORAGE
let todosFromLocalStorage = JSON.parse(localStorage.getItem("todos"));
let completedTodosFromLocalStorage = JSON.parse(localStorage.getItem("completedTodos"));

if (todosFromLocalStorage) {
  todos = todosFromLocalStorage;
  renderTodos();
  if (completedTodosFromLocalStorage) {
    checkCompletedTodos();
  }
}

//Event listeners
todoInputEl.addEventListener("keypress", createNewTodo);
todoList.addEventListener("click", updateTodo);
sortTodo.addEventListener("click", filterTodo);
clearCompletedTodoBtn.addEventListener("click", clearCompletedTodo);

//FUNCTIONS

// Create new todo
function createNewTodo(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    if (todoInputEl.value) {
      if (localStorage.getItem("todos")) {
        todos = JSON.parse(localStorage.getItem("todos"));
        todos.push(todoInputEl.value);
        localStorage.setItem("todos", JSON.stringify(todos));
      } else {
        todos.push(todoInputEl.value);
        localStorage.setItem("todos", JSON.stringify(todos));
      }
      todoForm.reset();
      renderTodos();
    }
  }
}
// When the page is refreshed, this checks if there were completed todos on the page before and apply the checkmark accordingly.
// Doing this by getting the completed todos stored in local storgae (line 231) and comparing it with the todos on the screen. If any of them matches, it applies the completed todo styles.

function checkCompletedTodos() {
  let completedTodos = JSON.parse(localStorage.getItem("completedTodos"));
  let todosOnScreen = todoList.childNodes;
  if (completedTodos) {
    for (let i = 0; i < completedTodos.length; i++) {
      todosOnScreen.forEach((element) => {
        let todoInnerElements = element.childNodes;
        todoInnerElements.forEach((innerElement) => {
          if (innerElement.innerText === completedTodos[i]) {
            innerElement.classList.add("todo-completed");
            innerElement.previousSibling.classList.add("special-class");
            element.classList.add("complete-div");
            completedTodos.splice(i, 1);
          }
        });
      });
    }
  }
}

// shows todos on screen

function renderTodos() {
  let todoItems = "";
  for (let i = 0; i < todos.length; i++) {
    todoItems += `<li class = "todo"><input type="radio" name="radio-button" class="check-todo"><span class ="todo-text"> ${todos[i]} </span><img src="images/icon-cross.svg" class="delete-todo-btn"></li>`;
    todoList.innerHTML = todoItems;
    checkCompletedTodos();
  }
  countTodo();
}

// Delete todo and check/uncheck todo as completed

function updateTodo(e) {
  let completedTodos = [];
  const item = e.target;
  if (item.classList.contains("delete-todo-btn")) {
    let currentTodo = item.parentElement;
    let currentTodoInnerContents = currentTodo.childNodes;
    let currentTodosOnScreen = JSON.parse(localStorage.getItem("todos"));
    completedTodos = JSON.parse(localStorage.getItem("completedTodos"));
    for (let i = 0; i < currentTodosOnScreen.length; i++) {
      currentTodoInnerContents.forEach((element) => {
        // if deleted todo is a completed task, remove it from the completedTodos container in local storage so it doesn't get rendered on the screen when checkCompletedTodos() is called .... line 20

        if (completedTodos) {
          for (let j = 0; j < completedTodos.length; j++) {
            if (
              element.innerText === currentTodosOnScreen[i] &&
              completedTodos[j]
            ) {
              completedTodos.splice(j, 1);
              j--;
              localStorage.setItem(
                "completedTodos",
                JSON.stringify(completedTodos)
              );
            }
          }
        }
        if (element.innerText === currentTodosOnScreen[i]) {
          currentTodosOnScreen.splice(i, 1);
          i--;
          currentTodo.classList.add("fall");
          currentTodo.addEventListener("transitionend", function () {
            currentTodo.remove();
            localStorage.setItem("todos", JSON.stringify(currentTodosOnScreen));
          });
        } else {
          return;
        }
      });
    }
    countTodo();
  }

  if (item.classList.contains("check-todo")) {
    let todo = item.parentElement;
    let todoItems = todo.childNodes;
    todoItems.forEach(function (element) {
      if (element.classList.contains("todo-text")) {
        item.classList.toggle("special-class");
        element.classList.toggle("todo-completed");
        todo.classList.toggle("complete-div");
      }
    });
    countTodo();
  }
}

// Sort/filter through todos according to status - active, completed, all

function filterTodo(e) {
  let todos = todoList.childNodes;
  if (e.target.value === "all") {
    todos.forEach((todo) => {
      if (!todo.classList.contains("fall")) {
        todo.style.display = "grid";
      }
    });
  } else if (e.target.value === "completed") {
    todos.forEach((todo) => {
      if (todo.classList.contains("complete-div")) {
        todo.style.display = "grid";
      } else {
        todo.style.display = "none";
      }
    });
  } else {
    todos.forEach((todo) => {
      if (!todo.classList.contains("complete-div")) {
        todo.style.display = "grid";
      } else {
        todo.style.display = "none";
      }
    });
  }
}

// clear completed todos and remove them from local storage as well

function clearCompletedTodo(_event) {
  // Turn childnodes to array
  let todosItems = todoList.childNodes;
  let htmlObjArray = [];
  todosItems.forEach((todoItem) => {
    htmlObjArray.push(todoItem);
  });
  for (let i = 0; i < htmlObjArray.length; i++) {
    let todos = JSON.parse(localStorage.getItem("todos"));
    let completedTodos = JSON.parse(localStorage.getItem("completedTodos"));
    let todoItemInnerElements = htmlObjArray[i].childNodes;
    for (let j = 0; j < todos.length; j++) {
      todoItemInnerElements.forEach((innerElement) => {
        if (
          htmlObjArray[i].classList.contains("complete-div") &&
          innerElement.innerText === todos[j]
        ) {
          // remove the cleared todo from the completedTodos container in local storage so it doesn't get rendered on the screen when checkCompletedTodos() is called .... line 20

          for (let k = 0; k < completedTodos.length; k++) {
            if (innerElement.innerText === completedTodos[k]) {
              completedTodos.splice(k, 1);
              k--;
              localStorage.setItem(
                "completedTodos",
                JSON.stringify(completedTodos)
              );
            }
          }
          htmlObjArray[i].style.display = "none";
          htmlObjArray[i].remove();
          todos.splice(j, 1);
          localStorage.setItem("todos", JSON.stringify(todos));
          j--;
        }
      });
    }
  }
}

// Count todos and show uncompleted/active todos count on screen

function countTodo() {
  const totalTasksContent = todoList.childNodes;
  let totalTasks = [];
  let completedTasks = [];
  totalTasksContent.forEach((element) => {
    if (!element.classList.contains("fall")) {
      totalTasks.push(element);
    }
  });

  totalTasks.forEach((task) => {
    if (task.classList.contains("complete-div")) {
      let taskElements = task.childNodes;
      taskElements.forEach((element) => {
        if (element.classList.contains("todo-text")) {
          localStorage.setItem(
            "completedTodos",
            JSON.stringify(completedTasks)
          );
          completedTasks = JSON.parse(localStorage.getItem("completedTodos"));
          completedTasks.push(element.innerText);
          localStorage.setItem(
            "completedTodos",
            JSON.stringify(completedTasks)
          );
        }
      });
    }
  });
  const activeTasks = totalTasks.length - completedTasks.length;
  activeTodosCounter.innerText = activeTasks;
}

// Theme toggle function

function darkTheme() {
  const themeToggle = document.getElementById("theme-toggle").src;
  if (themeToggle.indexOf("images/icon-moon.svg") != -1) {
    document.getElementById("theme-toggle").src = "images/icon-sun.svg";
    const elementsToChangeWithTheme = document.querySelectorAll(
      ".form-group, .todos-block, .todo-sort, .create-todo-field, .clear-completed-btn, #todo-radio,body, header"
    );
    for (let i = 0; i < elementsToChangeWithTheme.length; i++) {
      elementsToChangeWithTheme[i].classList.add("dark");
    }
  } else {
    document.getElementById("theme-toggle").src = "images/icon-moon.svg";
    const elementsToChangeWithTheme = document.querySelectorAll(
      ".form-group, .todos-block, .todo-sort, .create-todo-field, .clear-completed-btn, #todo-radio,body, header"
    );
    for (let i = 0; i < elementsToChangeWithTheme.length; i++) {
      setTimeout(function () {
        elementsToChangeWithTheme[i].classList.remove("dark");
        elementsToChangeWithTheme[i].classList.add("light-animation");
      }, 30);
    }
  }
}
// Drag and Drop

new Sortable(todoList, {
  animation: 0,
  handle: ".todo",
  delay: 20,
  sort: "true",
});
