
exports.seed = function(knex, Promise) {
  return knex('garage').del()
    .then(() => {
      return knex('garage').insert([
        { item: 'mouse traps', reason: 'to catch all the mice', cleanliness: 'rancid' },
        { item: 'skateboard', reason: 'I am too old now', cleanliness: 'sparkling' },
        { item: 'hot rod', reason: 'it dont run no mo', cleanliness: 'dusty' },
        { item: 'old records', reason: 'because they were lame', cleanliness: 'rancid' },
      ]);
    });
};
