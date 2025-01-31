const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.VITE_MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('question_bank');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

connectDB();

app.get('/api/questions/:subjectCode', async (req, res) => {
  try {
    const questions = await db.collection('questions')
      .find({ subject_code: req.params.subjectCode })
      .toArray();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/questions', async (req, res) => {
  try {
    const result = await db.collection('questions').insertOne(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/questions/:id', async (req, res) => {
  try {
    const result = await db.collection('questions').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/questions/:id', async (req, res) => {
  try {
    const result = await db.collection('questions').deleteOne(
      { _id: new ObjectId(req.params.id) }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});