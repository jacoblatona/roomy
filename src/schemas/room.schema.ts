import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(2).max(30),
  description: z.string().min(10).max(255),
  tags: z.array(z.string()).nonempty(),
});

export type CreateRoomInput = z.TypeOf<typeof createRoomSchema>;
