import { Rating, User } from "@prisma/client";

// Rooms
export type RoomWithCreatorAndParticipants = {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  creator: User;
  participants?: User;
  createdAt: Date;
};

// Participants
export type ParticipantPlusUser = {
  id: string;
  user: User;
};

// Questions
export type QuestionPlusUser = {
  id: string;
  question: string;
  user: User;
  ratings: Rating[];
  createdAt: Date;
};
