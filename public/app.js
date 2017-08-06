const $itemName = $('.item-input--name');
const $itemReason = $('.item-input--reason');
const $itemCleanliness = $('.item-select');
const $sparklingCount = $('.item-count--sparkling');
const $dustyCount = $('.item-count--dusty');
const $rancidCount = $('.item-count--rancid');
const $totalCount = $('.item-count--total');

const getAllItems = () => {
  clearGarage();
  fetch('/api/v1/items')
  .then(response => response.json())
  .then(items => {
    appendItems(items)
    updateCounter(items)
  })
  .catch(error => console.log(error))
}

const addNewItem = (item) => {
  fetch('api/v1/items', {
    method: 'POST',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify(item)
  })
  .then(response => getAllItems())
  .catch(error => console.log('error: ', error))
}

const updateItem = (id, cleanliness) => {
  fetch(`/api/v1/items/${id}`, {
    method: 'PATCH',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify(cleanliness)
  })
  .then(response => getAllItems())
  .catch(error => console.log(error))
}

const deleteItem = (id) => {
  fetch(`/api/v1/items/${id}`, {
    method: 'DELETE'
  })
  .then(() => getAllItems())
  .catch(error => console.log(error))
}

const sortItems = (sort) => {
  fetch('/api/v1/items')
  .then(response => response.json())
  .then(items => sort(items))
}

const sortUp = (items) => {
  const sorted = items.sort((a, b) => {
    let itemA = a.item.toLowerCase();
    let itemB = b.item.toLowerCase();
    if (itemA < itemB) {
      return -1;
    }
    if (itemA > itemB) {
      return 1;
    }
  });
  clearGarage();
  appendItems(sorted);
}
const sortDown = (items) => {
  const sorted = items.sort((a, b) => {
    let itemA = a.item.toLowerCase();
    let itemB = b.item.toLowerCase();
    if (itemA < itemB) {
      return 1;
    }
    if (itemA > itemB) {
      return -1;
    }
  });
  clearGarage();
  appendItems(sorted);
}

const updateCounter = (items) => {
  const sparklingCount = items.filter(item => item.cleanliness === 'sparkling').length;
  const dustyCount = items.filter(item => item.cleanliness === 'dusty').length;
  const rancidCount = items.filter(item => item.cleanliness === 'rancid').length;

  $sparklingCount.text(sparklingCount);
  $dustyCount.text(dustyCount);
  $rancidCount.text(rancidCount);
  $totalCount.text(items.length);
}

const clearInputs = () => {
  $itemName.val('');
  $itemReason.val('');
  $itemCleanliness.val('select cleanliness');
}

const clearGarage = () => {
  $('.garage').children('.item').remove();
}

const appendItems = (items) => {
  return items.map(item => {
    $('.garage').append(`
      <article class='item' id='${item.id}'>
        <button class='delete-btn'>
          <img class='delete' src='../images/delete.svg' alt='delete button'/>
        </button>
        <p class='item-name'>${item.item}</p>
        <div class='inner-content'>
          <p class='reason'>${item.reason}</p>
          <p class='cleanliness'>${item.cleanliness}
            <select class='update-cleanliness'>
              <option value='update cleanliness'>Update cleanliness</option>
              <option value='sparkling'>sparkling</option>
              <option value='dusty'>dusty</option>
              <option value='rancid'>rancid</option>
            </select>
          </p>
          <img class='up-arrow' src='../images/up-arrow.svg' alt='up arrow' />
        </div>
      </article>
    `)
  })
}

// $(document).on('load', function() {
  getAllItems();
// })

$('.add-item-btn').on('click', function(e) {
  e.preventDefault();
  const item = {
    item: $itemName.val(),
    reason: $itemReason.val(),
    cleanliness: $itemCleanliness.val()
  }
  addNewItem(item);
  clearInputs();
});

$('.garage').on('click', '.delete-btn', function() {
  const id = $(this).closest('.item').attr('id');
  deleteItem(id);
})

$('.garage').on('change', '.update-cleanliness', function(e) {
  $(this).prev().text(e.target.value);
  const cleanliness = { cleanliness: $(this).prev().text() }
  const id = $(this).closest('.item').attr('id');
  updateItem(id, cleanliness);
});

$('.open-btn').on('click', function() {
  $('.garage-door').addClass('open');
});

$('.close-btn').on('click', function() {
  $('.garage-door').removeClass('open');
});

$('.sort-btn').on('click', function() {
  if ($(this).text() === 'Sort A') {
    sortItems(sortUp);
  } else {
    sortItems(sortDown);
  }
});

$('.garage').on('click', '.item-name', function() {
  $(this).next('.inner-content').addClass('expand');
})

$('.garage').on('click', '.up-arrow', function() {
  $(this).closest('.inner-content').removeClass('expand');
})
