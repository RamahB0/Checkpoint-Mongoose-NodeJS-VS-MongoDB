/**
 * Checkpoint: Mongoose & NodeJS VS MongoDB
 *
 * This file walks through every instruction in the checkpoint, in order:
 *   1. Install & set up Mongoose, connect using the MONGO_URI env var.
 *   2. Define the Person schema/model.
 *   3. Create & save a single record.
 *   4. Create many records with Model.create().
 *   5. Use Model.find() to search by name.
 *   6. Use Model.findOne() to search by a favorite food.
 *   7. Use Model.findById() to search by _id.
 *   8. Classic update: find -> edit in JS -> save().
 *   9. Update in one step with Model.findOneAndUpdate().
 *  10. Delete one document with Model.findByIdAndRemove().
 *  11. Delete many documents with Model.remove() (deleteMany under the hood).
 *  12. Chain query helpers: find().sort().limit().select().exec().
 *
 * NOTE: this file cannot be executed inside this sandbox because it has no
 * network access to a real MongoDB Atlas cluster - it is meant to be run
 * against your own MongoDB Atlas URI (see .env.example) with:
 *
 *     npm install
 *     cp .env.example .env   # then fill in your real MONGO_URI
 *     node myApp.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// -----------------------------------------------------------------------
// 1. Connect to the database
// -----------------------------------------------------------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// -----------------------------------------------------------------------
// 2. Create a "Person" Model
// -----------------------------------------------------------------------
const { Schema } = mongoose;

const personSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
});

const Person = mongoose.model('Person', personSchema);

// -----------------------------------------------------------------------
// 3. Create and Save a Record of a Model
// -----------------------------------------------------------------------
const createAndSavePerson = (done) => {
  const person = new Person({
    name: 'John Doe',
    age: 26,
    favoriteFoods: ['pizza', 'sushi'],
  });

  person.save(function (err, data) {
    if (err) return done(err);
    done(null, data);
  });
};

// -----------------------------------------------------------------------
// 4. Create Many Records with model.create()
// -----------------------------------------------------------------------
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function (err, people) {
    if (err) return done(err);
    done(null, people);
  });
};

// -----------------------------------------------------------------------
// 5. Use model.find() to Search Your Database
// -----------------------------------------------------------------------
const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, function (err, people) {
    if (err) return done(err);
    done(null, people);
  });
};

// -----------------------------------------------------------------------
// 6. Use model.findOne() to Return a Single Matching Document
// -----------------------------------------------------------------------
const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, function (err, person) {
    if (err) return done(err);
    done(null, person);
  });
};

// -----------------------------------------------------------------------
// 7. Use model.findById() to Search Your Database By _id
// -----------------------------------------------------------------------
const findPersonById = (personId, done) => {
  Person.findById(personId, function (err, person) {
    if (err) return done(err);
    done(null, person);
  });
};

// -----------------------------------------------------------------------
// 8. Perform Classic Updates by Running Find, Edit, then Save
// -----------------------------------------------------------------------
const findEditThenSave = (personId, done) => {
  const foodToAdd = 'hamburger';

  Person.findById(personId, function (err, person) {
    if (err) return done(err);
    person.favoriteFoods.push(foodToAdd);
    // Needed only if favoriteFoods were declared as a plain Array
    // (Mixed type) instead of [String]:
    // person.markModified('favoriteFoods');
    person.save(function (err, updatedPerson) {
      if (err) return done(err);
      done(null, updatedPerson);
    });
  });
};

// -----------------------------------------------------------------------
// 9. Perform New Updates on a Document Using model.findOneAndUpdate()
// -----------------------------------------------------------------------
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet },
    { new: true },
    function (err, updatedPerson) {
      if (err) return done(err);
      done(null, updatedPerson);
    }
  );
};

// -----------------------------------------------------------------------
// 10. Delete One Document Using model.findByIdAndRemove
// -----------------------------------------------------------------------
const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, function (err, removedPerson) {
    if (err) return done(err);
    done(null, removedPerson);
  });
};

// -----------------------------------------------------------------------
// 11. MongoDB and Mongoose - Delete Many Documents with model.remove()
// -----------------------------------------------------------------------
const removeManyPeople = (done) => {
  const nameToRemove = 'Mary';

  Person.remove({ name: nameToRemove }, function (err, result) {
    if (err) return done(err);
    done(null, result);
  });
};

// -----------------------------------------------------------------------
// 12. Chain Search Query Helpers to Narrow Search Results
// -----------------------------------------------------------------------
const queryChain = (done) => {
  const foodToSearch = 'burrito';

  Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 })
    .limit(2)
    .select({ age: 0 })
    .exec(function (err, data) {
      if (err) return done(err);
      done(null, data);
    });
};

// -----------------------------------------------------------------------
// Exports (Node convention with (err, data) callbacks throughout)
// -----------------------------------------------------------------------
exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
