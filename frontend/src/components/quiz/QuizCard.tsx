import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, HelpCircle, ChevronRight, Loader2 } from 'lucide-react';
import { ROUTES } from '../../app/routes';
import type { QuizSummary } from '../../types/quiz';

interface QuizCardProps {
  quiz: QuizSummary;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  onDelete,
  isDeleting,
}) => {
  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      `Are you sure you want to delete "${quiz.title}"?`,
    );
    if (confirmed) {
      onDelete(quiz.id);
    }
  };

  return (
    <Link
      to={ROUTES.QUIZ_DETAIL(quiz.id)}
      className="group relative flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:border-indigo-300 hover:shadow-md sm:p-5"
    >
      <div className="min-w-0 flex-1 pr-4">
        <h3 className="truncate text-base font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
          {quiz.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
          <HelpCircle className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span>
            {quiz.questionsCount}{' '}
            {quiz.questionsCount === 1 ? 'question' : 'questions'}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          aria-label={`Delete quiz ${quiz.title}`}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin text-red-600" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
        <ChevronRight className="h-5 w-5 text-slate-400 transition-colors group-hover:text-slate-600" />
      </div>
    </Link>
  );
};
