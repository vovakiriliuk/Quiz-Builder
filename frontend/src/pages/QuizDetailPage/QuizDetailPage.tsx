import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, FileQuestion, HelpCircle } from 'lucide-react';
import { quizService } from '../../services/quizService';
import { ROUTES } from '../../app/routes';
import type { Quiz } from '../../types/quiz';
import { QuestionView } from '../../components/quiz/QuestionView';
import { Spinner } from '../../components/common/Spinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const QuizDetailPage: React.FC = () => {
  const { id: rawId } = useParams<{ id: string }>();
  const numericId = rawId ? Number(rawId) : NaN;
  const isInvalidId =
    !rawId ||
    Number.isNaN(numericId) ||
    !Number.isInteger(numericId) ||
    numericId <= 0;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(!isInvalidId);
  const [isNotFound, setIsNotFound] = useState<boolean>(isInvalidId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isInvalidId) {
      return;
    }

    const controller = new AbortController();

    quizService
      .getQuizById(numericId, { signal: controller.signal })
      .then((data) => {
        setQuiz(data);
        setIsNotFound(false);
        setError(null);
      })
      .catch((err: unknown) => {
        if (
          axios.isCancel(err) ||
          (err instanceof Error && err.name === 'CanceledError')
        ) {
          return;
        }

        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setIsNotFound(true);
        } else {
          const message =
            err instanceof Error ? err.message : 'Failed to load quiz details';
          setError(message);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [isInvalidId, numericId]);

  const handleRetry = () => {
    setLoading(true);
    setIsNotFound(false);
    setError(null);

    quizService
      .getQuizById(numericId)
      .then((data) => {
        setQuiz(data);
      })
      .catch((err: unknown) => {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setIsNotFound(true);
        } else {
          const message =
            err instanceof Error ? err.message : 'Failed to load quiz details';
          setError(message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Spinner size="lg" label="Loading quiz details..." />
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="rounded-full bg-slate-100 p-4 text-slate-400">
          <FileQuestion className="h-10 w-10" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Quiz not found
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          The requested quiz does not exist or may have been deleted.
        </p>
        <Link
          to={ROUTES.QUIZZES}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quizzes
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          to={ROUTES.QUIZZES}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quizzes
        </Link>
        <ErrorMessage
          title="Error Loading Quiz"
          message={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  const sortedQuestions = [...quiz.questions].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={ROUTES.QUIZZES}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quizzes
        </Link>

        <div className="mt-4 flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 break-words sm:text-3xl">
            {quiz.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-slate-400" />
              {quiz.questions.length}{' '}
              {quiz.questions.length === 1 ? 'question' : 'questions'}
            </span>
            {quiz.createdAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                {new Date(quiz.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sortedQuestions.map((question, index) => (
          <QuestionView key={question.id} question={question} index={index} />
        ))}
      </div>
    </div>
  );
};
