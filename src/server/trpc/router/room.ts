import { router, publicProcedure, protectedProcedure } from "../trpc";
import { createRoomSchema } from "../../../schemas/room.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const roomRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.room.findMany({
      include: {
        creator: true,
        questions: true,
        participants: true,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  }),
  getRoom: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
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
              answer: true,
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
            tags: JSON.stringify(input.tags),
          },
        });

        return room;
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: e as string,
        });
      }
    }),

  joinRoom: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const room = await ctx.prisma.room.findUnique({
        where: { id: input.roomId },
        select: {
          id: true,
          creatorId: true,
        },
      });

      if (ctx.session.user.id === room?.creatorId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You cannot join a room you created silly! You are already in!",
        });
      }

      const inRoom = await ctx.prisma.participant.findFirst({
        where: {
          roomId: input.roomId,
          userId: ctx.session.user.id,
        },
      });

      if (inRoom) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are already a participant in this room",
        });
      }

      try {
        const participant = await ctx.prisma.participant.create({
          data: {
            roomId: input.roomId,
            userId: ctx.session.user.id,
          },
        });

        return participant;
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There was an error joining the room.",
        });
      }
    }),
  leaveRoom: protectedProcedure
    .input(
      z.object({
        roomId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const currentParticipant = await ctx.prisma.participant.findFirst({
        where: {
          roomId: input.roomId,
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });

      if (!currentParticipant) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You cannot leave a room you are not a part of.",
        });
      }

      try {
        await ctx.prisma.participant.delete({
          where: {
            id: currentParticipant.id,
          },
        });

        return null;
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There was an error leaving the room.",
        });
      }
    }),
});
