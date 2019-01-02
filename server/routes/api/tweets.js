const express = require("express");
const mongodb = require("mongodb");
const pad = require("zero-pad");
const router = express.Router();
const mongoURI =
  "mongodb+srv://<username>:<password>@<serveradress>/test?retryWrites=true";

// Get tweets
router.get("/", async (req, res) => {
  const tweets = await loadTweetCollection();
  res.send(await tweets.find({}).toArray());
});
// Add tweets
router.post("/", async (req, res) => {
  const tweets = await loadTweetCollection();
  await tweets.insertOne({
    username: req.body.username,
    displayname: req.body.displayname,
    message: req.body.message,
    likes: 0,
    postDate: `${pad(new Date().getUTCDate())}.${pad(
      new Date().getUTCMonth() + 1
    )}.${new Date().getUTCFullYear()} at ${pad(new Date().getUTCHours())}:${pad(
      new Date().getUTCMinutes()
    )}`,
    createdAt: new Date()
  });
  res.status(201).send();
});
// Update tweets
router.put("/:id", async (req, res) => {
  const tweets = await loadTweetCollection();
  await tweets.updateOne(
    { _id: new mongodb.ObjectID(req.params.id) },
    { $set: { likes: req.body.likes } },
    { upsert: true }
  );
  res.status(200).send();
});
// Delete tweets
router.delete("/:id", async (req, res) => {
  const tweets = await loadTweetCollection().catch(err => console.log(err));
  await tweets.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
  res.status(200).send();
});

async function loadTweetCollection() {
  const client = await mongodb.MongoClient.connect(
    mongoURI,
    { useNewUrlParser: true }
  );
  return client.db("mevnDB").collection("tweets");
}

module.exports = router;
