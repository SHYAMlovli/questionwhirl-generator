import { MongoClient, ObjectId } from 'mongodb';

const uri = import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export const connectToMongoDB = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('question_bank');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export const findQuestionsBySubject = async (subjectCode: string) => {
  const db = await connectToMongoDB();
  const questions = await db.collection('questions')
    .find({ subject_code: subjectCode })
    .toArray();
  return questions;
};

export const insertQuestion = async (question: any) => {
  const db = await connectToMongoDB();
  const result = await db.collection('questions').insertOne(question);
  return result;
};

export const updateQuestion = async (id: string, question: any) => {
  const db = await connectToMongoDB();
  const result = await db.collection('questions').updateOne(
    { _id: new ObjectId(id) },
    { $set: question }
  );
  return result;
};

export const deleteQuestion = async (id: string) => {
  const db = await connectToMongoDB();
  const result = await db.collection('questions').deleteOne({ _id: new ObjectId(id) });
  return result;
};

export const insertQuestions = async (questions: any[]) => {
  const db = await connectToMongoDB();
  const result = await db.collection('questions').insertMany(questions);
  return result;
};