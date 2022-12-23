import { router, publicProcedure, protectedProcedure } from "../trpc";
import { createQuestionSchema } from "../../../schemas/room.schema";
import { TRPCError } from "@trpc/server";
import { createRatingSchema } from "../../../schemas/question.schema";

export const questionRouter = router({
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

  createRating: protectedProcedure
    .input(createRatingSchema)
    .mutation(async ({ input, ctx }) => {
      const existingRating = await ctx.prisma.rating.findFirst({
        where: {
          questionId: input.questionId,
          userId: ctx.session.user.id,
        },
      });

      if (existingRating) {
        const updatedRating = await ctx.prisma.rating.update({
          where: { id: existingRating.id },
          data: {
            type: input.type,
          },
        });

        return updatedRating;
      }

      try {
        const rating = await ctx.prisma.rating.create({
          data: {
            type: input.type,
            userId: ctx.session.user.id,
            questionId: input.questionId,
          },
        });

        return rating;
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There was an error creating a rating.",
        });
      }
    }),
});
