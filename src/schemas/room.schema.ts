import * as zod from "zod";
import { z } from "zod";

export const createRoomSchema = zod.object({
  name: zod.string().min(2).max(30),
  topic: zod.string().min(2).max(30),
  description: zod.string().min(10).max(255),
});

export type CreateRoomInput = z.TypeOf<typeof createRoomSchema>;
