import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(2).max(30),
  description: z.string().min(10).max(255),
});

export const getRoomSchema = z.object({
  id: z.string(),
});

export const createQuestionSchema = z.object({
  question: z.string().min(5).max(255),
  roomId: z.string(),
});

export type CreateRoomInput = z.TypeOf<typeof createRoomSchema>;
export type CreateQuestionInput = z.TypeOf<typeof createQuestionSchema>;
