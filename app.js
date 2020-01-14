// variables
const links = document.querySelector('.links ul');
const addItem = document.querySelector('.add-item input');
const addIcon = document.querySelector('.add-icon i');
const search = document.querySelector('#search');
let ul = document.querySelector('.tasks');
let taskLi = document.querySelectorAll('.tasks li');
const remainingItems = document.querySelector('.remaining');
const clearCompleted = document.querySelector('.clear-btn');
let dragged;

// check local storage and initialise the ul from ls
if(localStorage.getItem('todos')) {
  ul.innerHTML = JSON.parse(localStorage.getItem('todos'));
}

// check and display active items
activeCounter();

// make items drag and sort 
dragItems();
// add event listeners 
links.addEventListener('click', clickedLink);
addItem.addEventListener('keydown', addTaskItem);
addIcon.addEventListener('click', addTaskItem);
search.addEventListener('keyup', searchList);
clearCompleted.addEventListener('click', clearTasks);
ul.addEventListener('click', markSwitch);
ul.addEventListener('click', removeItem);

// make clicked link active
function clickedLink(e) {
  if(e.target.tagName === 'LI'){
    Array.from(links.children).forEach( link => {
      if(link.className === 'clicked') {
        link.className = '';
        e.target.classList.add('clicked');
      }
    })
    navigate(e);
  }
}

// navigate menu and display corresponding elements
function navigate(e) {
    if(e.target.textContent === 'All') {
      Array.from(ul.children).forEach(item => item.style.display = 'flex');
    } else if(e.target.textContent === 'Active') {
      filterItems('done');
    } else if(e.target.textContent === 'Completed') {
      filterItems('active');
    }
}

// filter out the items that are not displayed
function filterItems(status) {
  Array.from(ul.children).forEach(item => item.style.display = 'flex');
  Array.from(ul.children)
      .filter(item => item.children[0].classList.contains(status))
      .map(item => item.style.display = 'none');
}

// add task input
function addTaskItem(e) {
  // check if the pressed key is enter or clicked the add icon
  if(e.keyCode === 13 || e.target.parentElement.className === 'add-icon') {
    userInput = addItem.value;
    addToList(userInput);
    clearInput();
    activeCounter();
    updateLS();
  }
}

// clear the input
function clearInput(e) {
  addItem.value = '';
}

// add the user's input to list
function addToList(userInput) {
  let createLi = document.createElement('li');
  createLi.setAttribute('draggable', true);
  htmlTemplete = `
  </i><i class="far fa-circle active"></i>
  <p>${userInput}</p>
  <i class="far fa-times-circle close"></i>`;

  // add html templete to ul
  createLi.innerHTML = htmlTemplete;
  ul.prepend(createLi);

  // prevent showing active task to completed view
  Array.from(ul.children).forEach(item => item.style.display = 'flex');
  Array.from(links.children).forEach( link => {
    if(link.className === 'clicked') {
      link.className = '';
    }
  })
  links.firstElementChild.classList.add('clicked');
}

// make an item completed or undo it
function markSwitch(e) {
  if(e.target.classList.contains('done') || e.target.classList.contains('active')){
    if(e.target.classList.contains('done')){
      e.target.classList = 'far fa-circle active';
    } else {
      e.target.classList = 'fas fa-check-circle done';
    }
  }
  activeCounter();
  updateLS();
}

// remove task item
function removeItem(e) {
  if(e.target.classList.contains('close')){
    e.target.parentElement.remove();
  }
  activeCounter();
  updateLS();
}

// search list and filter out results
function searchList(e) {
  // hide item that do not match
  Array.from(ul.children)
  .filter(item => !item.children[1].textContent.toLowerCase().includes(e.target.value.toLowerCase()))
  .map(item => item.style.display = 'none');
  // show items that match up
  Array.from(ul.children)
  .filter(item => item.children[1].textContent.toLowerCase().includes(e.target.value.toLowerCase()))
  .map(item => item.style.display = 'flex');
}

// active items counter
function activeCounter(){
  activesLength = Array.from(ul.children).filter(item => item.children[0].classList.contains('active')).length;
  // update the display
  remainingItems.innerHTML = `<p>${activesLength} ${(activesLength === 1) ? 'Item': 'Items'} left</p>`
}

// clear the completed tasks function
function clearTasks(e){
  Array.from(ul.children)
    .filter(item => item.children[0].classList.contains('done'))
    .map(item => item.remove());
    updateLS();
}

// drag and drop a list item with mouse
function dragItems(){
  ul.addEventListener('dragstart', e => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", null);
    dragged = e.target;
    setTimeout(() => dragged.style.visibility = 'hidden', 50);
  });

  ul.addEventListener('dragend', e => {
    setTimeout(() => {
      dragged.style.visibility = '', 50;
      updateLS();
    })
  });

  ul.addEventListener('dragenter', e => {
    if(e.target.tagName === 'LI'){
      item = e.target;
      e.preventDefault();
      if(item === dragged.nextElementSibling) {
        item.parentNode.insertBefore(item, dragged);
      } else if(item === dragged.previousElementSibling) {
        item.parentNode.insertBefore(dragged, item);
      } 
    }
  })
}

// locale storage update function
function updateLS(){
  const todos = [];
  todos.push(ul.innerHTML)
  localStorage.setItem('todos', JSON.stringify(todos));
}