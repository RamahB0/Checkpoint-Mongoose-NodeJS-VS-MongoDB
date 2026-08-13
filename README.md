# Checkpoint: Mongoose & NodeJS VS MongoDB

Solution for the "NoSQL Cloud Datastores : Mongoose & MongoDB vS NodeJS"
checkpoint — a `Person` model exercised through every core Mongoose CRUD
operation.

## What's here

- `myApp.js` – the actual deliverable: connects to MongoDB via Mongoose
  (`mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true,
  useUnifiedTopology: true })`), defines the `Person` schema/model, and
  implements every required function (create & save, create many, find,
  findOne, findById, find-edit-save, findOneAndUpdate, findByIdAndRemove,
  remove, and a chained query with sort/limit/select). Every function
  uses a Node-style `(err, data)` callback as the instructions specify.
- `simulate.js` – a local, dependency-free re-implementation of the same
  operations against a plain in-memory array, used to verify the expected
  behavior of each step. This was used to double-check the logic in an
  environment without network access to a real MongoDB Atlas cluster.
- `output.txt` – captured output of `node simulate.js`, showing the
  result of every step (create, create many, find by name, findOne by
  food, findById, edit+save, findOneAndUpdate, removeById, removeMany,
  and the chained query).
- `package.json` – dependencies (`mongoose`, `mongodb`, `dotenv`).
- `.env.example` – template for the required `.env` file; copy it to
  `.env` and fill in your real MongoDB Atlas connection string as
  `MONGO_URI`.

## Person schema

```js
const personSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
});
```

## Running it for real

```bash
npm install
cp .env.example .env   # then edit .env with your real MONGO_URI
node myApp.js
```

## Running the local verification only (no MongoDB needed)

```bash
node simulate.js > output.txt
```
