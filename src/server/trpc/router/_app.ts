import { router } from "../trpc";
import { authRouter } from "./auth";
import { questionRouter } from "./question";
import { roomRouter } from "./room";

export const appRouter = router({
  auth: authRouter,
  room: roomRouter,
  question: questionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
