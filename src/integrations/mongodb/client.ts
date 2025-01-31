const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

export const findQuestions = async () => {
  const response = await fetch(`${API_URL}/questions`);
  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }
  return response.json();
};

export const findQuestionsBySubject = async (subjectCode: string) => {
  const response = await fetch(`${API_URL}/questions/subject/${subjectCode}`);
  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }
  return response.json();
};

export const insertQuestion = async (questionData: any) => {
  const response = await fetch(`${API_URL}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionData),
  });
  if (!response.ok) {
    throw new Error('Failed to insert question');
  }
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
  if (!response.ok) {
    throw new Error('Failed to update question');
  }
  return response.json();
};

export const deleteQuestion = async (id: string) => {
  const response = await fetch(`${API_URL}/questions/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete question');
  }
  return response.json();
};