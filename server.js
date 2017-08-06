const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const validatePost = (item) => {
  const itemProps = ['item', 'reason', 'cleanliness'];
  const propCheck = itemProps.every(prop => item.hasOwnProperty(prop));
  const propLength = Object.keys(item).length === 3;
  return (propCheck && propLength);
}

const validatePatch = (item) => {
  const itemProps = Object.keys(item);
  return (itemProps.includes('cleanliness') && itemProps.length === 1);
}

app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (error, file) => {
    response.send(file)
  })
})

app.get('/api/v1/items', (request, response) => {
  database('garage').select()
    .then(items => {
      response.status(200).json(items)
    })
    .catch(error => {
      console.log(error);
      response.status(404).send({ error: 'Route not found.' })
    })
});

app.post('/api/v1/items', (request, response) => {
  const item = request.body;
  if (validatePost(item)) {
    database('garage').insert(item, 'id')
      .then(item => {
        response.status(201).json({ id: item[0] })
      })
      .catch(error => response.status(500).send({ error: error }))
  } else {
    response.status(422).send({ error: 'Unprocessable entity.'})
  }
});

app.patch('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;
  const updatedItem = request.body;

  if (validatePatch(updatedItem)) {
    database('garage').where('id', id).update(updatedItem)
      .then(item => {
        response.status(201).send('item has been updated.');
      })
      .catch(error => response.status(500).send({ error: error }))
    } else {
      response.status(422).send({ error: 'Unprocessable entity.'});
    };
});

app.delete('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;

  if (!id) {
    console.log('hi');
  }

  database('garage').where('id', id).select()
  .then(item => {
    if (!item.length) {
      response.status(404).send('item not found.')
    } else {
      database('garage').where('id', id).del()
      .then(item => {
        response.status(204).send('item has been deleted.');
      })
    }
  })
  .catch(error => response.status(500).send({ error: error }));
});

app.listen(app.get('port'), () => {
  console.log(`server running on port ${app.get('port')}`);
});

module.exports = app;
