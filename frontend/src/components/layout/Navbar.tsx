import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sparkles, PlusCircle, ListChecks } from 'lucide-react';
import { ROUTES } from '../../app/routes';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          to={ROUTES.QUIZZES}
          className="flex items-center gap-2 text-lg font-bold text-indigo-600 transition-colors hover:text-indigo-700"
        >
          <Sparkles className="h-6 w-6" />
          <span>Quiz Builder</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <NavLink
            to={ROUTES.QUIZZES}
            end
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <ListChecks className="h-4 w-4" />
            <span>Quizzes</span>
          </NavLink>
          <NavLink
            to={ROUTES.CREATE}
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create Quiz</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
