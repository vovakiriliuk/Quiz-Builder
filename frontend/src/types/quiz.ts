import { z } from 'zod';

export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export interface QuestionOption {
  id: number;
  text: string;
  isCorrect: boolean;
  questionId?: number;
}

export interface BaseQuestion {
  id: number;
  order: number;
  text: string;
}

export interface BooleanQuestion extends BaseQuestion {
  type: 'BOOLEAN';
  correctBool: boolean | null;
  correctText: string | null;
  options: QuestionOption[];
}

export interface InputQuestion extends BaseQuestion {
  type: 'INPUT';
  correctBool: boolean | null;
  correctText: string | null;
  options: QuestionOption[];
}

export interface CheckboxQuestion extends BaseQuestion {
  type: 'CHECKBOX';
  correctBool: boolean | null;
  correctText: string | null;
  options: QuestionOption[];
}

export type Question = BooleanQuestion | InputQuestion | CheckboxQuestion;

export interface Quiz {
  id: number;
  title: string;
  createdAt: string;
  questions: Question[];
}

export interface QuizSummary {
  id: number;
  title: string;
  questionsCount: number;
}

export const booleanQuestionSchema = z.object({
  type: z.literal('BOOLEAN'),
  text: z.string().trim().min(1, 'Question text is required'),
  correctBool: z.boolean({
    message: 'Please select true or false',
  }),
});

export const inputQuestionSchema = z.object({
  type: z.literal('INPUT'),
  text: z.string().trim().min(1, 'Question text is required'),
  correctText: z.string().trim().min(1, 'Correct answer is required'),
});

export const checkboxOptionSchema = z.object({
  text: z.string().trim().min(1, 'Option text cannot be empty'),
  isCorrect: z.boolean(),
});

export const checkboxQuestionSchema = z.object({
  type: z.literal('CHECKBOX'),
  text: z.string().trim().min(1, 'Question text is required'),
  options: z
    .array(checkboxOptionSchema)
    .min(2, 'Must have at least 2 options')
    .refine((options) => options.some((opt) => opt.isCorrect), {
      message: 'At least one option must be correct',
    }),
});

export const questionSchema = z.discriminatedUnion('type', [
  booleanQuestionSchema,
  inputQuestionSchema,
  checkboxQuestionSchema,
]);

export const createQuizSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  questions: z
    .array(questionSchema)
    .min(1, 'At least one question is required'),
});

export type CreateQuizPayload = z.infer<typeof createQuizSchema>;
export type CreateQuestionPayload = z.infer<typeof questionSchema>;
export type CreateOptionPayload = z.infer<typeof checkboxOptionSchema>;
