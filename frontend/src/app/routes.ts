export const ROUTES = {
  HOME: '/',
  CREATE: '/create',
  QUIZZES: '/quizzes',
  QUIZ_DETAIL_PATTERN: '/quizzes/:id',
  QUIZ_DETAIL: (id: number | string) => `/quizzes/${id}`,
} as const;
