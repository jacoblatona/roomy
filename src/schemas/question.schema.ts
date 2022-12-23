import { z } from "zod";

export const createQuestionSchema = z.object({
  question: z.string().min(5).max(255),
  roomId: z.string(),
});

export const createRatingSchema = z.object({
  type: z.string(),
  questionId: z.string(),
});

export type CreateQuestionInput = z.TypeOf<typeof createQuestionSchema>;
