import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAtom } from "jotai";
import { isAnswerQuestionModalOpenAtom } from "../../atoms/modals";
import { trpc } from "../../utils/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  type AnswerQuestionInput,
  answerQuestionSchema,
} from "../../schemas/question.schema";
import { selectedQuestionAtom } from "../../atoms/question";

type Props = {
  id: string;
  question: string;
  author: string;
};

const AnswerQuestionModal: React.FC<Props> = ({
  id,
  question,
  author,
}: Props) => {
  const [open, setOpen] = useAtom(isAnswerQuestionModalOpenAtom);
  const cancelButtonRef = useRef(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [selectedQuestion] = useAtom(selectedQuestionAtom);

  useEffect(() => {
    reset({
      questionId: selectedQuestion.id,
    });

    return () => {
      reset({
        questionId: undefined,
        answer: undefined,
      });
    };
  }, [selectedQuestion]);

  const utils = trpc.useContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnswerQuestionInput>({
    resolver: zodResolver(answerQuestionSchema),
  });

  const { mutate, error } = trpc.question.answerQuestion.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Question answered successfully");
      setOpen(false);
      reset({
        answer: "",
      });

      utils.room.getRoom.invalidate();
    },
    onSettled: () => {
      setProcessing(false);
    },
  });

  const onSubmit = async (data: AnswerQuestionInput) => {
    setProcessing(true);
    mutate(data);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-5 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-slate-800 px-4 pt-5 pb-4 text-left transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-8">
                <h1 className="text-lg font-medium tracking-tight text-white sm:text-center">
                  Answer Question
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input type="hidden" value={id} {...register("questionId")} />
                  <div className="mt-5 flex flex-col space-y-5">
                    <div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-white"
                        >
                          Question
                        </label>
                        <span className="block text-sm text-white/50">
                          Posted by /{author}
                        </span>
                      </div>
                      <div className="mt-1">
                        <div className="w-full rounded-md bg-slate-700 p-3 text-white">
                          {question}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-white"
                      >
                        Answer
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          className="block w-full rounded-md border-0 bg-slate-700 p-3 text-white focus:outline-none focus:ring-0 sm:text-sm"
                          rows={4}
                          {...register("answer")}
                        ></textarea>
                        <p className="text-sm text-red-500">
                          {errors.answer?.message}
                        </p>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {processing ? "Processing..." : "Submit Answer"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AnswerQuestionModal;
