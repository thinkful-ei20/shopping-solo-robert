'use strict';


const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  displayChecked: true,
  filterby: '',

};

function generateItemElement(item, itemIndex) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <a class="editButton" href="">edit</a>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  shoppingList = shoppingList.filter(item => ~item.name.indexOf(STORE.filterby));
	
  if (STORE.displayChecked) {
    const items = shoppingList.map((item, index) => generateItemElement(item, index));

    return items.join('');
  } else {
    const items = shoppingList.filter(unchecked => unchecked.checked === false)
      .map((item, index) => generateItemElement(item, index));
    return items.join('');
  }
}


function renderShoppingList() {
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);

  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteListItem(itemIndex) {
  STORE.items.splice(itemIndex,1);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteListItem(itemIndex);
    renderShoppingList();
  });
}

function handleDisplayCheckedItems() {
  $('.displayChecked').change(() =>{
    STORE.displayChecked = !STORE.displayChecked;
    renderShoppingList();
  });
}

function handleSearchInput() {
  $('.itemSearch').keyup( e	 => {
    STORE.filterby = $(e.target).val();
    renderShoppingList();
  });
}

function itemEditHandler () {
  let placeHolder;
  let itemIndex;
  $('.js-shopping-list').on('click', '.editButton', e => {
    itemIndex = getItemIndexFromElement(e.currentTarget);
    e.preventDefault();
		
    placeHolder = $(e.target).siblings('span').text();
		
    $(e.target).siblings('span').replaceWith(`<input type= "text"
		class="editItem" value= ${placeHolder}>`);
  });
	
  $('.js-shopping-list').keyup( e => {
    if (e.which === 13) {
      if ($(e.target).val() === placeHolder) renderShoppingList();
      else STORE.items[itemIndex].name = $(e.target).val();
      renderShoppingList();    
    }
    
  });
}


function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleDisplayCheckedItems();
  handleSearchInput();
  itemEditHandler();
}

$(handleShoppingList);