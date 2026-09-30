import React from 'react';
import {
  useFieldArray,
  type Control,
  type UseFormRegister,
  type FieldErrors,
} from 'react-hook-form';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import type { CreateQuizPayload } from '../../types/quiz';

interface CheckboxOptionsProps {
  questionIndex: number;
  control: Control<CreateQuizPayload>;
  register: UseFormRegister<CreateQuizPayload>;
  errors: FieldErrors<CreateQuizPayload>;
}

interface OptionItemError {
  text?: { message?: string };
}

interface OptionsErrorStructure {
  message?: string;
  root?: { message?: string };
  [key: number]: OptionItemError | undefined;
}

export const CheckboxOptions: React.FC<CheckboxOptionsProps> = ({
  questionIndex,
  control,
  register,
  errors,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options` as never,
  });

  const questionErrors = errors.questions?.[questionIndex];
  const optionsError =
    questionErrors && 'options' in questionErrors
      ? (questionErrors.options as OptionsErrorStructure | undefined)
      : undefined;

  const optionsErrorMessage =
    optionsError?.message || optionsError?.root?.message;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold tracking-wide uppercase text-slate-500">
          Answer Options (select at least one correct)
        </label>
        <button
          type="button"
          onClick={() => append({ text: '', isCorrect: false })}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Option
        </button>
      </div>

      {optionsErrorMessage && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {optionsErrorMessage}
        </p>
      )}

      <div className="space-y-2.5">
        {fields.map((field, optionIndex) => {
          const optionError = optionsError?.[optionIndex];
          const textError = optionError?.text?.message;

          return (
            <div key={field.id} className="space-y-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register(
                      `questions.${questionIndex}.options.${optionIndex}.isCorrect` as never,
                    )}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-medium text-slate-600 sm:hidden">
                    Correct
                  </span>
                </label>

                <input
                  type="text"
                  placeholder={`Option ${optionIndex + 1} text`}
                  {...register(
                    `questions.${questionIndex}.options.${optionIndex}.text` as never,
                  )}
                  className={`min-w-0 flex-1 rounded-lg border bg-white px-3 py-2 text-sm shadow-2xs transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    textError
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
                  }`}
                />

                <button
                  type="button"
                  onClick={() => remove(optionIndex)}
                  disabled={fields.length <= 2}
                  title={
                    fields.length <= 2
                      ? 'Must have at least 2 options'
                      : 'Remove option'
                  }
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {textError && (
                <p className="ml-6 flex items-center gap-1 text-xs text-red-600 sm:ml-7">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {textError}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
