import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../app/routes';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="rounded-full bg-slate-100 p-4 text-slate-500">
        <FileQuestion className="h-12 w-12 text-slate-400" />
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Page Not Found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="mt-6">
        <Link
          to={ROUTES.QUIZZES}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quizzes
        </Link>
      </div>
    </div>
  );
};
