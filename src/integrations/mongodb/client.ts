const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const findQuestionsBySubject = async (subjectCode: string) => {
  const response = await fetch(`${API_URL}/api/questions/${subjectCode}`);
  if (!response.ok) throw new Error('Failed to fetch questions');
  return response.json();
};

export const insertQuestion = async (question: any) => {
  const response = await fetch(`${API_URL}/api/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(question),
  });
  if (!response.ok) throw new Error('Failed to insert question');
  return response.json();
};

export const updateQuestion = async (id: string, question: any) => {
  const response = await fetch(`${API_URL}/api/questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(question),
  });
  if (!response.ok) throw new Error('Failed to update question');
  return response.json();
};

export const deleteQuestion = async (id: string) => {
  const response = await fetch(`${API_URL}/api/questions/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete question');
  return response.json();
};

export const insertQuestions = async (questions: any[]) => {
  const promises = questions.map(q => insertQuestion(q));
  return Promise.all(promises);
};