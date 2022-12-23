import { router, publicProcedure, protectedProcedure } from "../trpc";
import {
  createQuestionSchema,
  createRoomSchema,
  getRoomSchema,
} from "../../../schemas/room.schema";
import { TRPCError } from "@trpc/server";

export const roomRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.room.findMany({
      include: {
        creator: true,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  }),
  getRoom: publicProcedure
    .input(getRoomSchema)
    .query(async ({ input, ctx }) => {
      const room = await ctx.prisma.room.findUnique({
        where: { id: input.id },
        include: {
          creator: true,
          participants: {
            include: {
              user: true,
            },
          },
          questions: {
            orderBy: [{ createdAt: "desc" }],
            include: {
              user: true,
              ratings: true,
            },
          },
        },
      });
      return room;
    }),
  createRoom: protectedProcedure
    .input(createRoomSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const room = await ctx.prisma.room.create({
          data: {
            name: input.name,
            description: input.description,
            creatorId: ctx.session.user.id,
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
  createQuestion: protectedProcedure
    .input(createQuestionSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const question = await ctx.prisma.question.create({
          data: {
            question: input.question,
            userId: ctx.session.user.id,
            roomId: input.roomId,
          },
        });

        return question;
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There was an error creating a question.",
        });
      }
    }),
});
