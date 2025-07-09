const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

// Functions
// display items

function displayItems() {
  const localStorage = getItemsFromStorage();
  localStorage.forEach(item => addItemToDOM(item));
  resetUI();
}

// Adding Items
function onaddItemsSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value.trim();
  //Basic validation
  if (newItem === '' || newItem === ' ') {
    alert('Please enter a valid input ');
    return;
  }

  //is editable
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('Item alredy exists');
      return;
    }
  }

  // Create list item and add to DOM
  addItemToDOM(newItem);
  // Adding item to storgae
  addItemsToStorage(newItem);
  resetUI();
  itemInput.value = '';
}

// add items to DOM
function addItemToDOM(item) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  itemList.appendChild(li);
}
// function addItemsToStorage(item) {
//   let itemFromStorage;
//   if (localStorage.getItem('items') === null) {
//     itemFromStorage = [];
//   } else {
//     itemFromStorage = JSON.parse(localStorage.getItem('items'));
//   }
//   itemFromStorage.push(item);
//   // convert to JSON string and set to local storage
//   localStorage.setItem('items', JSON.stringify(itemFromStorage));
// }

// add items to storage
function addItemsToStorage(item) {
  const itemFromStorage = getItemsFromStorage();
  itemFromStorage.push(item);
  // converting JSON to string
  localStorage.setItem('myItem', JSON.stringify(itemFromStorage));
}

function createButton(classes) {
  const newButton = document.createElement('button');
  newButton.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  newButton.appendChild(icon);
  return newButton;
}

function createIcon(classes) {
  const newIcon = document.createElement('i');
  newIcon.className = classes;
  return newIcon;
}

//
function getItemsFromStorage() {
  let itemFromStorage;
  if (localStorage.getItem('item') === null) {
    itemFromStorage = [];
  } else {
    itemFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemFromStorage;
}

// onclick items

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemstoEdit(e.target);
  }
}

// check if item exists

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemstoEdit(item) {
  isEditMode = true;
  itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>  Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent.trim();
}

// Removing items

function removeItem(item) {
  if (confirm('Are you sure')) {
    // remove item from DOM
    item.remove();
  }
  // remove item from DOM
  removeItemFromStorage(item.textContent);
  // chat gpt below code
  itemFilter.value = ''; // Clear the filter input
  filterItems({ target: itemFilter });

  resetUI();
}

// removing items from Storage

function removeItemFromStorage(item) {
  let itemFromStorage = getItemsFromStorage();
  // filter out item to be removed
  itemFromStorage = itemFromStorage.filter(i => i !== item);
  // reset to local storage
  localStorage.setItem('items', JSON.stringify(itemFromStorage));
}

// Remove all items
function clearAll(e) {
  // We can do that as below
  //   itemList.innerHTML = '';
  if (confirm('are you sure ')) {
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }
  }

  localStorage.removeItem('items');

  resetUI();
}

// Filtering Items

// function filterItems(e) {
//   const items = itemList.querySelectorAll('li');
//   const text = e.target.value.toLowerCase();

//   items.forEach(item => {
//     const itemName = item.firstChild.textContent.toLowerCase();
//     // console.log(itemName);

//     if (itemName.indexOf(text) != -1) {
//       //   console.log('true');
//       item.style.display = 'flex';
//     } else {
//       //   console.log(false);
//       item.style.display = 'none';
//     }
//   });
//   //   console.log(text);
// }

function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach(item => {
    const itemName = item.firstChild.textContent.toLowerCase();
    // console.log(itemName);

    if (itemName.indexOf(text) != -1) {
      // console.log('true');
      item.style.display = 'flex';
    } else {
      // console.log('false');
      item.style.display = 'none';
    }
  });
}

// Local storage
// localStorage.setItem('name', 'Hasan');
// console.log(localStorage.getItem('name'));
// // console.log(localStorage.removeItem('name'));
// localStorage.clear();

// Reset UI to deafult as page loads
// need to put   const items = itemList.querySelectorAll('li'); inside the function as queryselectorAll is a nodelist and is static not dynamic

function resetUI() {
  itemInput.value = '';
  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"> </i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
}

// Event listeners
function init() {
  itemForm.addEventListener('submit', onaddItemsSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearAll);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  resetUI();
}

init();
