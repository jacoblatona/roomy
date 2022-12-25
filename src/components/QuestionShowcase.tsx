import moment from "moment";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { type IQuestion } from "../types";
import { trpc } from "../utils/trpc";
import { isAnswerQuestionModalOpenAtom } from "../atoms/modals";
import { useAtom } from "jotai";
import { selectedQuestionAtom } from "../atoms/question";

type QuestionProps = {
  question: IQuestion;
  creatorId: string | undefined;
};

export const QuestionShowcase: React.FC<QuestionProps> = ({
  question,
  creatorId,
}: QuestionProps) => {
  const { data: sessionData } = useSession();

  const [rating, setRating] = useState<string | undefined>();
  const [open, setOpen] = useAtom(isAnswerQuestionModalOpenAtom);
  const [, setSelectedQuestion] = useAtom(selectedQuestionAtom);

  useEffect(() => {
    if (sessionData) {
      for (let i = 0; i < question.ratings?.length; i++) {
        if (question.ratings[i]?.userId === sessionData.user?.id) {
          setRating(question.ratings[i]?.type);
        }
      }
    }

    return () => setRating(undefined);
  }, [sessionData, question.ratings]);

  const likes = question.ratings?.filter((rating) => {
    return rating.type === "like";
  });

  const utils = trpc.useContext();

  const { mutate, error, data } = trpc.question.createRating.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      setRating(data.type);
      utils.room.getRoom.invalidate();
    },
  });

  const handleSubmit = async (type: string) => {
    mutate({
      type,
      questionId: question.id,
    });
  };

  return (
    <>
      <div className="flex w-full items-center justify-between rounded-md bg-slate-700 px-5 py-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="items-center text-xs text-white/50 md:text-sm">
              Posted by /{question.user?.name}
            </span>
            <div className="h-1 w-1 rounded-full bg-white/50"></div>
            <span className="text-xs text-white/50 md:text-sm">
              {" "}
              {moment(question.createdAt).fromNow()}
            </span>
          </div>
          <p className="text-xl font-bold text-white">{question.question}</p>
          {sessionData &&
            sessionData?.user?.id === creatorId &&
            !question.answer && (
              <p
                className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-bold text-indigo-500"
                onClick={() => {
                  setSelectedQuestion({
                    id: question.id,
                    question: question.question,
                    author: question.user.name as string,
                  });
                  setOpen(!open);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                  />
                </svg>
                Answer Question
              </p>
            )}
          {question.answer && (
            <div className="mt-3 flex gap-2">
              <div>
                <span className="inline-flex items-center rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-medium text-white">
                  Answer
                </span>
              </div>
              <p className="text-green-500">{question.answer.answer}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-3 text-white/50">
          <svg
            onClick={() => (rating !== "like" ? handleSubmit("like") : null)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`h-6 w-6 cursor-pointer ${
              rating === "like" && "text-green-500"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>

          <span className="text-white/50">{likes?.length}</span>
          <svg
            onClick={() =>
              rating !== "dislike" ? handleSubmit("dislike") : null
            }
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`h-6 w-6 cursor-pointer ${
              rating === "dislike" && "text-red-500"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </div>
    </>
  );
};
