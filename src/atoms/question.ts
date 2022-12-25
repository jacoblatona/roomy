import { atom } from "jotai";

type QuestionData = {
  id: string;
  question: string;
  author: string;
};

export const selectedQuestionAtom = atom<QuestionData>({
  id: "",
  question: "",
  author: "",
});
