import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { roomRouter } from "./room";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  room: roomRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
