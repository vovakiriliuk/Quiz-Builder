import { api } from './axiosService';
import type { Quiz, QuizSummary, CreateQuizPayload } from '../types/quiz';

export const quizService = {
  getQuizzes: async (options?: {
    signal?: AbortSignal;
  }): Promise<QuizSummary[]> => {
    const response = await api.get<QuizSummary[]>('/quizzes', {
      signal: options?.signal,
    });
    return response.data;
  },

  getQuizById: async (
    id: number,
    options?: { signal?: AbortSignal },
  ): Promise<Quiz> => {
    const response = await api.get<Quiz>(`/quizzes/${id}`, {
      signal: options?.signal,
    });
    return response.data;
  },

  createQuiz: async (quizData: CreateQuizPayload): Promise<Quiz> => {
    const response = await api.post<Quiz>('/quizzes', quizData);
    return response.data;
  },

  deleteQuiz: async (id: number): Promise<void> => {
    const response = await api.delete<void>(`/quizzes/${id}`);
    return response.data;
  },
};
