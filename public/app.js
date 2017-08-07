const $itemName = $('.input-name');
const $itemCleanliness = $('.item-select');
const $itemReason = $('.input-reason');
const $dustyCount = $('.count-dusty');
const $totalCount = $('.count-total');
const $rancidCount = $('.count-rancid');
const $sparklingCount = $('.count-sparkling');

let sortType = 'none'
let garageStatus = 'closed'

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

const addItem = (item) => {
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

const sortAll = (items) => {
  if (sortType === 'none' || sortType === 'down') {
    const sorted = items.sort((a, b) => {
      return a.item.toLowerCase() < b.item.toLowerCase()
    });
    clearGarage();
    appendItems(sorted);
    sortType = 'up'
  } else {
    const sorted = items.sort((a, b) => {
      return a.item.toLowerCase() > b.item.toLowerCase()
    });
    clearGarage();
    appendItems(sorted);
    sortType = 'down'
  }
}

const updateCounter = (items) => {
  const rancidCount = items.filter(item => item.cleanliness === 'RANCID').length;
  const dustyCount = items.filter(item => item.cleanliness === 'DUSTY').length;
  const sparklingCount = items.filter(item => item.cleanliness === 'SPARKLING').length;

  $sparklingCount.text(sparklingCount);
  $dustyCount.text(dustyCount);
  $rancidCount.text(rancidCount);
  $totalCount.text(items.length);
}

const clearInputs = () => {
  $itemReason.val('');
  $itemName.val('');
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

$('.add-item').on('click', function(e) {
  e.preventDefault();
  if( !$itemName.val() || !$itemReason.val() || !$itemCleanliness.val()){
    return alert('Please Enter All Fields');
  }
  const item = {
    item: $itemName.val(),
    reason: $itemReason.val(),
    cleanliness: $itemCleanliness.val()
  }
  addItem(item);
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
  updateItem(id, cleanliness);
});

$('.garage').on('click', '.item', function(e) {
  if (e.target.className === 'update-cleanliness') {
    return
  }
  $(this).children().last().hasClass('expand')
    ?
    $(this).children().last().removeClass('expand')
    :
    $(this).children().last().addClass('expand');
})

$('.garage-btn').on('click', function() {
  if (garageStatus === 'closed') {
    $('.door').addClass('open')
    garageStatus = 'open'
    $(this).addClass('garage-closed')
    $(this).text('Close Garage')
    $(this).removeClass('garage-open')
  } else {
    $('.door').removeClass('open')
    garageStatus = 'closed'
    $(this).addClass('garage-open')
    $(this).text('Open Garage')
    $(this).removeClass('garage-closed')
  }
});

$('.close-btn').on('click', function() {
  $('.door').removeClass('open');
});

$('.sort-btn').on('click', a() {
  if ($(this).text() === 'Sort A-Z') {
    $(this).text('Sort Z-A')
  } else {
    $(this).text('Sort A-Z')
  }
  fetch('/api/v1/items')
    .then(response => response.json())
    .then(items => sortAll(items))
});
