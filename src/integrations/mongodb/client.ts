import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority";

export const mongoClient = new MongoClient(uri);

export const connectDB = async () => {
  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB!");
    return mongoClient.db("question_bank");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export const questionsCollection = async () => {
  const db = await connectDB();
  return db.collection('questions');
};

export const profilesCollection = async () => {
  const db = await connectDB();
  return db.collection('profiles');
};

export const insertQuestion = async (questionData: any) => {
  const collection = await questionsCollection();
  const result = await collection.insertOne(questionData);
  return { ...questionData, _id: result.insertedId };
};

export const updateQuestion = async (id: string, questionData: any) => {
  const collection = await questionsCollection();
  return collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: questionData }
  );
};

export const deleteQuestion = async (id: string) => {
  const collection = await questionsCollection();
  return collection.deleteOne({ _id: new ObjectId(id) });
};

export const findQuestions = async (query = {}) => {
  const collection = await questionsCollection();
  return collection.find(query).toArray();
};

export const findQuestionsBySubject = async (subjectCode: string) => {
  const collection = await questionsCollection();
  return collection.find({ subject_code: subjectCode }).toArray();
};