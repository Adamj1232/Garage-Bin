
exports.seed = function(knex, Promise) {
  return knex('garage').del()
    .then(() => {
      return knex('garage').insert([
        { item: 'mouse traps', reason: 'to catch all the mice', cleanliness: 'RANCID' },
        { item: 'skateboard', reason: 'I am too old now', cleanliness: 'SPARKLING' },
        { item: 'hot rod', reason: 'it dont run no mo', cleanliness: 'DUSTY' },
        { item: 'old records', reason: 'because they were lame', cleanliness: 'RANCID' },
      ]);
    });
};
