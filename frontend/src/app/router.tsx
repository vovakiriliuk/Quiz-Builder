import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import { Layout } from '../components/layout/Layout';
import { QuizListPage } from '../pages/QuizListPage/QuizListPage';
import { CreateQuizPage } from '../pages/CreateQuizPage/CreateQuizPage';
import { QuizDetailPage } from '../pages/QuizDetailPage/QuizDetailPage';
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.QUIZZES} replace />,
      },
      {
        path: ROUTES.CREATE,
        element: <CreateQuizPage />,
      },
      {
        path: ROUTES.QUIZZES,
        element: <QuizListPage />,
      },
      {
        path: ROUTES.QUIZ_DETAIL_PATTERN,
        element: <QuizDetailPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
