const $itemName = $('.item-input--name');
const $itemReason = $('.item-input--reason');
const $itemCleanliness = $('.item-select');
const $sparklingCount = $('.item-count--sparkling');
const $dustyCount = $('.item-count--dusty');
const $rancidCount = $('.item-count--rancid');
const $totalCount = $('.item-count--total');

const getAll = () => {
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
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(item)
    })
    .then(response => getAll())
    .catch(error => console.log('error: ', error))
}

const deleteItem = (id) => {
  fetch(`/api/v1/items/${id}`, {
      method: 'DELETE'
    })
    .then(() => getAll())
    .catch(error => console.log(error))
}

const updateItem = (id, cleanliness) => {
  fetch(`/api/v1/items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(cleanliness)
    })
    .then(response => getAll())
    .catch(error => console.log(error))
}

const sortItems = (sort) => {
  fetch('/api/v1/items')
    .then(response => response.json())
    .then(items => sort(items))
}

const sortUp = (items) => {
  const sorted = items.sort((a, b) => {
    if (a.item.toLowerCase() < b.item.toLowerCase()) {
      return -1;
    }
    if (a.item.toLowerCase() > b.item.toLowerCase()) {
      return 1;
    }
  });
  clearGarage();
  appendItems(sorted);
}

const sortDown = (items) => {
  const sorted = items.sort((a, b) => {
    if (a.item.toLowerCase() < b.item.toLowerCase()) {
      return 1;
    }
    if (a.item.toLowerCase() > b.item.toLowerCase()) {
      return -1;
    }
  });
  clearGarage();
  appendItems(sorted);
}

const updateCounter = (items) => {
  const sparklingCount = items.filter(item => item.cleanliness === 'SPARKLING').length;
  const dustyCount = items.filter(item => item.cleanliness === 'DUSTY').length;
  const rancidCount = items.filter(item => item.cleanliness === 'RANCID').length;

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
        <div class='delete-div'>
          Delete
        </div>
        <p class='item-name'>${item.item}</p>
        <div class='inner-content'>
          <p class='reason'>Storage Reason: ${item.reason}</p>
          <p class='cleanliness'>Cleanliness: ${item.cleanliness}
            <select class='update-cleanliness'>
              <option value='update cleanliness'>Update cleanliness</option>
              <option value='sparkling'>SPARKLING</option>
              <option value='dusty'>DUSTY</option>
              <option value='rancid'>RANCID</option>
            </select>
          </p>
        </div>
      </article>
    `)
  })
}

getAll();

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

$('.garage').on('click', '.delete-div', function() {
  const id = $(this).closest('.item').attr('id');
  deleteItem(id);
})

$('.garage').on('change', '.update-cleanliness', function(e) {
  const cleanliness = {
    cleanliness: $(this).prev().text(e.target.value).prevObject[0].value.toUpperCase()
  }
  const id = $(this).closest('.item').attr('id');
  console.log(cleanliness);
  updateItem(id, cleanliness);
});

$('.garage').on('click', '.item', function() {
  $(this).children().last().hasClass('expand') ?
    $(this).children().last().removeClass('expand') :
    $(this).children().last().addClass('expand');
})

$('.open-btn').on('click', function() {
  $('.door').addClass('open');
});

$('.close-btn').on('click', function() {
  $('.door').removeClass('open');
});

$('.sort-btn').on('click', function() {
  if ($(this).text() === 'Sort A') {
    sortItems(sortUp);
  } else {
    sortItems(sortDown);
  }
});
