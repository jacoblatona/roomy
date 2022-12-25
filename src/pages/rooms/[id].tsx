import { type NextPage } from "next";
import Head from "next/head";
import Layout from "../../components/Layout";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import AskQuestionModal from "../../components/modals/AskQuestionModal";
import { useAtom } from "jotai";
import {
  isAskQuestionModalOpenAtom,
  isLoginModalOpenAtom,
  selectedQuestionAtom,
} from "../../atoms";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { ParticipantShowcase } from "../../components/ParticipantShowcase";
import { QuestionShowcase } from "../../components/QuestionShowcase";
import AnswerQuestionModal from "../../components/modals/AnswerQuestionModal";
import { useState } from "react";

const Room: NextPage = () => {
  const { data: sessionData } = useSession();

  const [open, setOpen] = useAtom(isAskQuestionModalOpenAtom);
  const [openAlt, setOpenAlt] = useAtom(isLoginModalOpenAtom);
  const [selectedQuestion] = useAtom(selectedQuestionAtom);

  const Router = useRouter();
  const id = Router.query.id as string;

  const { data: room } = trpc.room.getRoom.useQuery({ id });

  const inRoom = room?.participants.some((value) => {
    return value.userId === sessionData?.user?.id;
  });

  const utils = trpc.useContext();

  // JOIN ROOM
  const { mutate: joinRoomMutation, error: joinRoomError } =
    trpc.room.joinRoom.useMutation({
      onError: (joinRoomError) => {
        toast.error(joinRoomError.message);
      },
      onSuccess: () => {
        toast.success("You have joined the room.");
        utils.room.getRoom.invalidate();
      },
    });

  const joinRoom = async () => {
    joinRoomMutation({
      roomId: id,
    });
  };

  // LEAVE ROOM
  const { mutate: leaveRoomMutation, error: leaveRoomError } =
    trpc.room.leaveRoom.useMutation({
      onError: (leaveRoomError) => {
        toast.error(leaveRoomError.message);
      },
      onSuccess: () => {
        toast.success("You have left the room.");
        utils.room.getRoom.invalidate();
      },
    });

  const leaveRoom = async () => {
    leaveRoomMutation({
      roomId: id,
    });
  };

  const [filter, setFilter] = useState<string>("unanswered");
  const unansweredQuestions = room?.questions.filter((question) => {
    return !question.answer;
  });

  const answeredQuestions = room?.questions.filter((question) => {
    return question.answer;
  });

  return (
    <>
      <Head>
        <title>Roomy - View Room</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="mx-auto max-w-xs py-16 lg:container">
          <div className="flex flex-col gap-10 lg:flex-row">
            <div className="w-full lg:grow">
              <div className="flex flex-col-reverse justify-between gap-5 lg:flex-row lg:gap-10">
                <div>
                  <h1 className="text-4xl font-bold text-white">
                    {room?.name}
                  </h1>
                  <p className="break-words text-lg text-white/50">
                    {room?.description}
                  </p>
                  <div className="flex gap-2">
                    {room &&
                      JSON.parse(`${room.tags}`).map((tag: string) => (
                        <span
                          key={tag}
                          className="mt-2 inline-block flex-shrink-0 rounded-full bg-slate-600 px-2 py-0.5 text-xs font-medium text-white"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
                <div>
                  {inRoom ? (
                    <button
                      onClick={() => leaveRoom()}
                      type="button"
                      className="inline-flex items-center rounded-full border border-transparent bg-red-600 px-5 py-2 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-0 focus:ring-offset-0"
                    >
                      Leave Room
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        sessionData ? joinRoom() : setOpenAlt(!openAlt)
                      }
                      type="button"
                      className="inline-flex items-center rounded-full bg-indigo-600 px-5 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-0 focus:ring-offset-0"
                    >
                      Join Room
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-14 flex items-center gap-2">
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                  <h1 className="text-2xl font-semibold text-white">
                    Questions
                  </h1>
                  <div className="mt-5 flex flex-col items-center gap-7 lg:mt-0 lg:flex-row">
                    <span className="isolate inline-flex rounded-md shadow-sm">
                      <button
                        onClick={() => setFilter("unanswered")}
                        type="button"
                        className={`text-${
                          filter === "unanswered" ? "indigo-500" : "white"
                        } relative inline-flex items-center rounded-l-md border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium focus:z-10 focus:outline-none focus:ring-0`}
                      >
                        Unanswered
                        <sup className="ml-1">
                          {unansweredQuestions?.length}
                        </sup>
                      </button>

                      <button
                        onClick={() => setFilter("answered")}
                        type="button"
                        className={`text-${
                          filter === "answered" ? "indigo-500" : "white"
                        } focus:ring-indigo-0 relative -ml-px inline-flex items-center rounded-r-md border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium focus:z-10 focus:outline-none`}
                      >
                        Answered
                        <sup className="ml-1">{answeredQuestions?.length}</sup>
                      </button>
                    </span>
                    <span
                      onClick={() => setOpen(!open)}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 text-base font-medium text-white focus:outline-none focus:ring-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                      Ask Question
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-7 flex flex-col space-y-3">
                {filter === "unanswered"
                  ? unansweredQuestions?.map((question) => (
                      <QuestionShowcase
                        question={question}
                        creatorId={room?.creatorId}
                        key={question.id}
                      />
                    ))
                  : answeredQuestions?.map((question) => (
                      <QuestionShowcase
                        question={question}
                        creatorId={room?.creatorId}
                        key={question.id}
                      />
                    ))}
              </div>
            </div>
            <div className="w-full flex-none lg:w-80">
              <div className="w-full rounded-md lg:p-5">
                <p className="text-md font-bold text-white">Owner</p>
                <div className="mt-3 flex flex-col">
                  <div className="flex w-full items-center gap-2 rounded-md bg-slate-700 p-2 py-3">
                    <img
                      src={room?.creator.image as string}
                      className="h-9 w-9 rounded-full"
                      alt="room creator image"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">
                        {room?.creator.name}
                      </span>
                      <span className="text-xs text-indigo-400">Creator</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 w-full rounded-md lg:mt-0 lg:p-5">
                <div className="flex items-center justify-between">
                  <p className="text-md font-bold text-white">Members</p>
                  <span className="text-white">
                    {room?.participants.length}
                  </span>
                </div>
                <div className="mt-3 flex flex-col">
                  {room?.participants.map((participant) => (
                    <ParticipantShowcase
                      key={participant.id}
                      participant={participant}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
      <AskQuestionModal id={room?.id as string} />
      <AnswerQuestionModal
        id={selectedQuestion.id as string}
        question={selectedQuestion.question as string}
        author={selectedQuestion.author as string}
      />
    </>
  );
};

export default Room;
