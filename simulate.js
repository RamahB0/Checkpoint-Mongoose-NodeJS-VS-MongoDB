/**
 * Local simulation of myApp.js.
 *
 * This sandbox has no network access to a real MongoDB Atlas cluster, so
 * mongoose.connect() in myApp.js cannot actually be exercised here. This
 * script re-implements the same operations (insert, find, findOne,
 * findById, push+save, findOneAndUpdate, findByIdAndRemove, remove,
 * find+sort+limit+select) against a plain in-memory array with the same
 * semantics, purely to verify the expected behavior of myApp.js's logic
 * before running it for real with `node myApp.js` against your own
 * MongoDB Atlas URI.
 */

let seq = 1;
function objectId() {
  return 'ObjectId(' + String(seq++).padStart(24, '0') + ')';
}

function log(title, data) {
  console.log('\n=== ' + title + ' ===');
  console.log(JSON.stringify(data, null, 2));
}

let people = [];

// 3. createAndSavePerson
const john = { _id: objectId(), name: 'John Doe', age: 26, favoriteFoods: ['pizza', 'sushi'] };
people.push(john);
log('3. createAndSavePerson', john);

// 4. createManyPeople
const arrayOfPeople = [
  { name: 'Mary Smith', age: 45, favoriteFoods: ['burrito', 'salad'] },
  { name: 'Mary Smith', age: 33, favoriteFoods: ['tacos'] },
  { name: 'Akira Laine', age: 34, favoriteFoods: ['sushi', 'burrito'] },
  { name: 'Kim Chen', age: 51, favoriteFoods: ['burrito'] },
];
const created = arrayOfPeople.map((p) => ({ _id: objectId(), ...p }));
people.push(...created);
log('4. createManyPeople', created);

// 5. findPeopleByName("Mary Smith")
const byName = people.filter((p) => p.name === 'Mary Smith');
log('5. findPeopleByName("Mary Smith")', byName);

// 6. findOneByFood("sushi")
const byFood = people.find((p) => p.favoriteFoods.includes('sushi'));
log('6. findOneByFood("sushi")', byFood);

// 7. findPersonById(john._id)
const byId = people.find((p) => p._id === john._id);
log('7. findPersonById(john._id)', byId);

// 8. findEditThenSave(john._id): push "hamburger" then save
const editIndex = people.findIndex((p) => p._id === john._id);
people[editIndex].favoriteFoods.push('hamburger');
log('8. findEditThenSave -> John after push+save', people[editIndex]);

// 9. findAndUpdate("Akira Laine"): set age = 20, return updated doc
const updIndex = people.findIndex((p) => p.name === 'Akira Laine');
people[updIndex] = { ...people[updIndex], age: 20 };
log('9. findAndUpdate("Akira Laine") -> age set to 20', people[updIndex]);

// 10. removeById(john._id)
const removedIndex = people.findIndex((p) => p._id === john._id);
const [removedPerson] = people.splice(removedIndex, 1);
log('10. removeById(john._id) -> removed document', removedPerson);

// 11. removeManyPeople(): remove all people named "Mary Smith"
const beforeCount = people.length;
people = people.filter((p) => p.name !== 'Mary Smith');
const deletedCount = beforeCount - people.length;
log('11. removeManyPeople("Mary Smith")', { deletedCount });

// 12. queryChain: favoriteFoods contains "burrito", sort by name,
//     limit 2, hide age
const chained = people
  .filter((p) => p.favoriteFoods.includes('burrito'))
  .sort((a, b) => a.name.localeCompare(b.name))
  .slice(0, 2)
  .map(({ age, ...rest }) => rest);
log('12. queryChain(burrito, sort name, limit 2, hide age)', chained);

log('Final people collection', people);
