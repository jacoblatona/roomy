import { z } from "zod";

export const createQuestionSchema = z.object({
  question: z.string().min(5).max(255),
  roomId: z.string(),
});

export const createRatingSchema = z.object({
  type: z.string(),
  questionId: z.string(),
});

export const answerQuestionSchema = z.object({
  answer: z.string().min(2),
  questionId: z.string(),
});

export type CreateQuestionInput = z.TypeOf<typeof createQuestionSchema>;
export type AnswerQuestionInput = z.TypeOf<typeof answerQuestionSchema>;
