import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {
  ArrowLeft,
  Plus,
  Loader2,
  AlertCircle,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import {
  createQuizSchema,
  type CreateQuizPayload,
  type QuestionType,
} from '../../types/quiz';
import { quizService } from '../../services/quizService';
import { ROUTES } from '../../app/routes';
import { QuestionField } from '../../components/quiz/QuestionField';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const CreateQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [newQuestionType, setNewQuestionType] =
    useState<QuestionType>('BOOLEAN');

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CreateQuizPayload>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: '',
      questions: [
        {
          type: 'BOOLEAN',
          text: '',
          correctBool: true,
        },
      ],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'questions',
  });

  const handleAddQuestion = () => {
    switch (newQuestionType) {
      case 'BOOLEAN':
        append({
          type: 'BOOLEAN',
          text: '',
          correctBool: true,
        });
        break;
      case 'INPUT':
        append({
          type: 'INPUT',
          text: '',
          correctText: '',
        });
        break;
      case 'CHECKBOX':
        append({
          type: 'CHECKBOX',
          text: '',
          options: [
            { text: '', isCorrect: true },
            { text: '', isCorrect: false },
          ],
        });
        break;
    }
  };

  const handleTypeChange = (index: number, nextType: QuestionType) => {
    const currentText = getValues(`questions.${index}.text`) || '';

    switch (nextType) {
      case 'BOOLEAN':
        update(index, {
          type: 'BOOLEAN',
          text: currentText,
          correctBool: true,
        });
        break;
      case 'INPUT':
        update(index, {
          type: 'INPUT',
          text: currentText,
          correctText: '',
        });
        break;
      case 'CHECKBOX':
        update(index, {
          type: 'CHECKBOX',
          text: currentText,
          options: [
            { text: '', isCorrect: true },
            { text: '', isCorrect: false },
          ],
        });
        break;
    }
  };

  const onSubmit = async (data: CreateQuizPayload) => {
    setApiError(null);

    const payload: CreateQuizPayload = {
      title: data.title.trim(),
      questions: data.questions.map((q) => {
        switch (q.type) {
          case 'BOOLEAN':
            return {
              type: 'BOOLEAN',
              text: q.text.trim(),
              correctBool: q.correctBool,
            };
          case 'INPUT':
            return {
              type: 'INPUT',
              text: q.text.trim(),
              correctText: q.correctText.trim(),
            };
          case 'CHECKBOX':
            return {
              type: 'CHECKBOX',
              text: q.text.trim(),
              options: q.options.map((opt) => ({
                text: opt.text.trim(),
                isCorrect: opt.isCorrect,
              })),
            };
        }
      }),
    };

    try {
      await quizService.createQuiz(payload);
      navigate(ROUTES.QUIZZES);
    } catch (err: unknown) {
      let message = 'Failed to create quiz. Please try again.';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        const backendMessage = err.response.data.message;
        message = Array.isArray(backendMessage)
          ? backendMessage.join(', ')
          : String(backendMessage);
      } else if (err instanceof Error) {
        message = err.message;
      }
      setApiError(message);
    }
  };

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
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Create New Quiz
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Configure a quiz with multiple question types and correct answers.
        </p>
      </div>

      {apiError && (
        <ErrorMessage
          title="Submission Failed"
          message={apiError}
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Quiz Title */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
          <label
            htmlFor="quiz-title"
            className="block text-sm font-semibold text-slate-900"
          >
            Quiz Title <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              id="quiz-title"
              type="text"
              placeholder="e.g. Web Development Fundamentals"
              {...register('title')}
              className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm shadow-2xs transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
              }`}
            />
            {errors.title && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.title.message}
              </p>
            )}
          </div>
        </div>

        {/* Questions Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-900">
              Questions ({fields.length})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <select
              aria-label="New question type"
              value={newQuestionType}
              onChange={(e) =>
                setNewQuestionType(e.target.value as QuestionType)
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="BOOLEAN">Boolean</option>
              <option value="INPUT">Text Input</option>
              <option value="CHECKBOX">Multiple Choice</option>
            </select>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </button>
          </div>
        </div>

        {errors.questions?.message && (
          <p className="flex items-center gap-1 text-xs font-medium text-red-600">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {errors.questions.message}
          </p>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {fields.map((field, index) => {
            const currentType = field.type;

            return (
              <QuestionField
                key={field.id}
                questionIndex={index}
                currentType={currentType}
                control={control}
                register={register}
                errors={errors}
                onRemove={() => remove(index)}
                isRemoveDisabled={fields.length <= 1}
                onTypeChange={(nextType) => handleTypeChange(index, nextType)}
              />
            );
          })}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-end">
          <Link
            to={ROUTES.QUIZZES}
            className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Quiz...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Create Quiz</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
