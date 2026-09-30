export const QUESTION_TYPES = ['BOOLEAN', 'INPUT', 'CHECKBOX'] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];
