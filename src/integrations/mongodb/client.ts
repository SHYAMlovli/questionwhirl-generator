// Instead of direct MongoDB connection, we'll use fetch API
const API_URL = 'https://your-backend-url/api'; // Replace with your actual backend URL

export const insertQuestion = async (questionData: any) => {
  const response = await fetch(`${API_URL}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionData),
  });
  return response.json();
};

export const updateQuestion = async (id: string, questionData: any) => {
  const response = await fetch(`${API_URL}/questions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionData),
  });
  return response.json();
};

export const deleteQuestion = async (id: string) => {
  const response = await fetch(`${API_URL}/questions/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};

export const findQuestions = async (query = {}) => {
  const queryString = new URLSearchParams(query as Record<string, string>).toString();
  const response = await fetch(`${API_URL}/questions?${queryString}`);
  return response.json();
};

export const findQuestionsBySubject = async (subjectCode: string) => {
  const response = await fetch(`${API_URL}/questions/subject/${subjectCode}`);
  return response.json();
};