import { router, publicProcedure, protectedProcedure } from "../trpc";
import { createRoomSchema } from "../../../schemas/room.schema";
import { TRPCError } from "@trpc/server";

export const roomRouter = router({
  createRoom: protectedProcedure
    .input(createRoomSchema)
    .mutation(async ({ input, ctx }) => {
      // Here some login stuff would happen

      try {
        const room = await ctx.prisma.room.create({
          data: {
            name: input.name,
            topic: input.topic,
            description: input.description,
            userId: ctx.session.user.id,
          },
        });

        return room;
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There was an error creating a room.",
        });
      }
    }),
});
