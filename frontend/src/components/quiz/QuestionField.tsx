import React from 'react';
import {
  type Control,
  type UseFormRegister,
  type FieldErrors,
  Controller,
} from 'react-hook-form';
import { Trash2, AlertCircle } from 'lucide-react';
import type { CreateQuizPayload, QuestionType } from '../../types/quiz';
import { CheckboxOptions } from './CheckboxOptions';

interface QuestionFieldProps {
  questionIndex: number;
  currentType: QuestionType;
  control: Control<CreateQuizPayload>;
  register: UseFormRegister<CreateQuizPayload>;
  errors: FieldErrors<CreateQuizPayload>;
  onRemove: () => void;
  isRemoveDisabled: boolean;
  onTypeChange: (newType: QuestionType) => void;
}

export const QuestionField: React.FC<QuestionFieldProps> = ({
  questionIndex,
  currentType,
  control,
  register,
  errors,
  onRemove,
  isRemoveDisabled,
  onTypeChange,
}) => {
  const questionErrors = errors.questions?.[questionIndex];
  const textError = questionErrors?.text?.message;
  const correctTextError =
    questionErrors && 'correctText' in questionErrors
      ? (questionErrors.correctText as { message?: string } | undefined)
          ?.message
      : undefined;
  const correctBoolError =
    questionErrors && 'correctBool' in questionErrors
      ? (questionErrors.correctBool as { message?: string } | undefined)
          ?.message
      : undefined;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow sm:p-6">
      {/* Header: Question Number, Type Selector, Remove Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
            {questionIndex + 1}
          </span>
          <span className="text-sm font-semibold text-slate-800">
            Question #{questionIndex + 1}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div className="flex items-center gap-2">
            <label
              htmlFor={`question-type-${questionIndex}`}
              className="text-xs font-medium text-slate-500"
            >
              Type:
            </label>
            <select
              id={`question-type-${questionIndex}`}
              value={currentType}
              onChange={(e) => onTypeChange(e.target.value as QuestionType)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="BOOLEAN">Boolean (True / False)</option>
              <option value="INPUT">Text Input</option>
              <option value="CHECKBOX">Multiple Choice</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onRemove}
            disabled={isRemoveDisabled}
            title={
              isRemoveDisabled
                ? 'A quiz must have at least one question'
                : 'Remove question'
            }
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Question Text */}
      <div className="mt-4 space-y-1.5">
        <label className="text-xs font-semibold tracking-wide uppercase text-slate-500">
          Question Text <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. What is the capital of France?"
          {...register(`questions.${questionIndex}.text` as never)}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm shadow-2xs transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
            textError
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
          }`}
        />
        {textError && (
          <p className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {textError}
          </p>
        )}
      </div>

      {/* Type Specific Fields */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        {currentType === 'BOOLEAN' && (
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wide uppercase text-slate-500">
              Correct Answer <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name={`questions.${questionIndex}.correctBool` as never}
              render={({ field }) => (
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none rounded-lg border border-slate-200 px-4 py-2.5 hover:bg-slate-50">
                    <input
                      type="radio"
                      name={`bool-${questionIndex}`}
                      checked={field.value === true}
                      onChange={() => field.onChange(true)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-800">
                      True
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none rounded-lg border border-slate-200 px-4 py-2.5 hover:bg-slate-50">
                    <input
                      type="radio"
                      name={`bool-${questionIndex}`}
                      checked={field.value === false}
                      onChange={() => field.onChange(false)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-800">
                      False
                    </span>
                  </label>
                </div>
              )}
            />
            {correctBoolError && (
              <p className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {correctBoolError}
              </p>
            )}
          </div>
        )}

        {currentType === 'INPUT' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wide uppercase text-slate-500">
              Correct Answer <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Paris"
              {...register(`questions.${questionIndex}.correctText` as never)}
              className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm shadow-2xs transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                correctTextError
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
              }`}
            />
            {correctTextError && (
              <p className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {correctTextError}
              </p>
            )}
          </div>
        )}

        {currentType === 'CHECKBOX' && (
          <CheckboxOptions
            questionIndex={questionIndex}
            control={control}
            register={register}
            errors={errors}
          />
        )}
      </div>
    </div>
  );
};
