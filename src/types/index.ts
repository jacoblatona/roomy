import {
  type Answer,
  type Participant,
  type Question,
  type Rating,
  type User,
} from "@prisma/client";

// Models
export type IRoom = {
  id: string;
  creatorId: string;
  creator: User;
  name: string;
  description: string;
  tags: string | null;
  questions: Question[];
  participants: Participant[];
  createdAt: Date;
};

export type IQuestion = {
  id: string;
  question: string;
  userId: string;
  user: User;
  roomId: string;
  ratings: Rating[];
  answer?: Answer | null;
  createdAt: Date;
};

export type IParticipant = {
  id: string;
  userId: string;
  user: User;
};
