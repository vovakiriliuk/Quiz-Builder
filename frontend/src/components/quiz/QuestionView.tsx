import React from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import type { Question } from '../../types/quiz';

interface QuestionViewProps {
  question: Question;
  index: number;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  index,
}) => {
  const getTypeBadge = () => {
    switch (question.type) {
      case 'BOOLEAN':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
            True / False
          </span>
        );
      case 'INPUT':
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-700/10">
            Text Input
          </span>
        );
      case 'CHECKBOX':
        return (
          <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 ring-1 ring-inset ring-purple-700/10">
            Multiple Choice
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <span className="text-sm font-semibold tracking-wide uppercase text-slate-500">
          Question {index + 1}
        </span>
        {getTypeBadge()}
      </div>

      <p className="mt-3 text-base font-medium text-slate-900 break-words sm:text-lg">
        {question.text}
      </p>

      <div className="mt-5">
        {question.type === 'BOOLEAN' && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label
              className={`flex flex-1 items-center justify-between rounded-lg border p-3.5 transition-colors ${
                question.correctBool === true
                  ? 'border-emerald-300 bg-emerald-50/60 font-medium text-emerald-900'
                  : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name={`bool-readonly-${question.id}`}
                  disabled
                  checked={question.correctBool === true}
                  className="h-4 w-4 text-emerald-600 focus:ring-0 disabled:cursor-not-allowed"
                />
                <span className="text-sm">True</span>
              </div>
              {question.correctBool === true && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <Check className="h-3.5 w-3.5" /> Correct
                </span>
              )}
            </label>

            <label
              className={`flex flex-1 items-center justify-between rounded-lg border p-3.5 transition-colors ${
                question.correctBool === false
                  ? 'border-emerald-300 bg-emerald-50/60 font-medium text-emerald-900'
                  : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name={`bool-readonly-${question.id}`}
                  disabled
                  checked={question.correctBool === false}
                  className="h-4 w-4 text-emerald-600 focus:ring-0 disabled:cursor-not-allowed"
                />
                <span className="text-sm">False</span>
              </div>
              {question.correctBool === false && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <Check className="h-3.5 w-3.5" /> Correct
                </span>
              )}
            </label>
          </div>
        )}

        {question.type === 'INPUT' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wide uppercase text-slate-500">
              Correct Answer
            </label>
            <div className="relative">
              <input
                type="text"
                disabled
                value={question.correctText ?? ''}
                className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm font-medium text-slate-800 disabled:cursor-not-allowed"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
          </div>
        )}

        {question.type === 'CHECKBOX' && (
          <div className="space-y-2.5">
            <span className="text-xs font-semibold tracking-wide uppercase text-slate-500">
              Options
            </span>
            <div className="grid gap-2">
              {question.options.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                    option.isCorrect
                      ? 'border-emerald-300 bg-emerald-50/60 text-emerald-950 font-medium'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <label className="flex min-w-0 flex-1 items-center gap-3 cursor-not-allowed">
                    <input
                      type="checkbox"
                      disabled
                      checked={option.isCorrect}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-0 disabled:cursor-not-allowed"
                    />
                    <span className="truncate text-sm">{option.text}</span>
                  </label>
                  {option.isCorrect && (
                    <span className="ml-2 shrink-0 inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                      <Check className="h-3 w-3" /> Correct
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
