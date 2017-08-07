const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);
const server = require('../server');

chai.use(chaiHttp);

describe('Garage Bin Tests', () => {

  before((done) => {
    database.migrate.latest()
    .then(() => done());
  });

  beforeEach((done) => {
    database.seed.run()
    .then(() => done());
  });

  describe('GET route', () => {

    it('should return all items', (done) => {
      chai.request(server)
      .get('/api/v1/items')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(4);
        response.body[0].should.have.property('item');
        response.body[0].should.have.property('reason');
        response.body[0].should.have.property('cleanliness');
        done();
      });
    });

    it('should throw an error for sad path', (done) => {
      chai.request(server)
      .get('/api/v1/itemssss')
      .end((error, response) => {
        response.error.should.have.status(404);
        response.error.text.should.equal('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot GET /api/v1/itemssss</pre>\n</body>\n</html>\n');
        done();
      });
    });
  });

  describe('POST route', () => {

    it('should add a new item to db', (done) => {
      chai.request(server)
      .post('/api/v1/items')
      .send({ item: 'dogs', reason: 'sprayed by a skunk', cleanliness: 'rancid' })
      .end((error, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.a('object');
        chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          response.body.length.should.equal(5);
        });
        done();
      });
    });

    it('should deny a post with missing data', (done) => {
      chai.request(server)
      .get('/api/v1/items')
      .end((error, response) => {
        response.body.length.should.equal(4);
        chai.request(server)
        .post('/api/v1/items')
        .send({ id: 4, item: 'bike', reason: 'it goes here' })
        .end((error, response) => {
          chai.request(server)
          .get('/api/v1/items')
          .end((error, response) => {
            response.body.length.should.equal(4);
            done();
          });
        });
      });
    });
  });


});
