import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Inbox } from 'lucide-react';
import { quizService } from '../../services/quizService';
import { ROUTES } from '../../app/routes';
import type { QuizSummary } from '../../types/quiz';
import { QuizCard } from '../../components/quiz/QuizCard';
import { Spinner } from '../../components/common/Spinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const QuizListPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    quizService
      .getQuizzes({ signal: controller.signal })
      .then((data) => {
        setQuizzes(data);
      })
      .catch((err: unknown) => {
        if (
          axios.isCancel(err) ||
          (err instanceof Error && err.name === 'CanceledError')
        ) {
          return;
        }
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to load quizzes. Please check your backend connection.';
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    quizService
      .getQuizzes()
      .then((data) => {
        setQuizzes(data);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to load quizzes. Please check your backend connection.';
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = async (id: number) => {
    setDeleteError(null);
    setDeletingId(id);
    try {
      await quizService.deleteQuiz(id);
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setDeleteError(`Failed to delete quiz: ${message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Quizzes
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse existing quizzes or build a new one.
          </p>
        </div>
        <Link
          to={ROUTES.CREATE}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Quiz</span>
        </Link>
      </div>

      {deleteError && (
        <ErrorMessage
          title="Delete Error"
          message={deleteError}
          className="mb-4"
        />
      )}

      {loading && (
        <div className="flex min-h-[300px] items-center justify-center">
          <Spinner size="lg" label="Loading quizzes..." />
        </div>
      )}

      {!loading && error && (
        <ErrorMessage
          title="Error Loading Quizzes"
          message={error}
          onRetry={handleRetry}
        />
      )}

      {!loading && !error && quizzes.length === 0 && (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
          <div className="rounded-full bg-indigo-50 p-4 text-indigo-600">
            <Inbox className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No quizzes found
          </h2>
          <p className="mt-1.5 max-w-sm text-sm text-slate-500">
            Get started by creating your first quiz with questions, inputs, and
            options.
          </p>
          <Link
            to={ROUTES.CREATE}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Create Quiz
          </Link>
        </div>
      )}

      {!loading && !error && quizzes.length > 0 && (
        <div className="grid gap-3 sm:gap-4">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onDelete={handleDelete}
              isDeleting={deletingId === quiz.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
