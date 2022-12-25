import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAtom } from "jotai";
import { isAskQuestionModalOpenAtom } from "../../atoms";
import { trpc } from "../../utils/trpc";
import {
  CreateQuestionInput,
  createQuestionSchema,
} from "../../schemas/question.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

type Props = {
  id: string;
};

const AskQuestionModal: React.FC<Props> = ({ id }: Props) => {
  const [open, setOpen] = useAtom(isAskQuestionModalOpenAtom);
  const cancelButtonRef = useRef(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const utils = trpc.useContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateQuestionInput>({
    resolver: zodResolver(createQuestionSchema),
  });

  const { mutate, error } = trpc.question.createQuestion.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Question posted succesfully");
      setOpen(false);
      reset({
        question: "",
      });

      utils.room.getRoom.invalidate();
    },
    onSettled: () => {
      setProcessing(false);
    },
  });

  const onSubmit = async (data: CreateQuestionInput) => {
    setProcessing(true);
    mutate({
      question: data.question,
      roomId: id,
    });
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
              <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-slate-800 px-4 pt-5 pb-4 text-left transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-8">
                <h1 className="text-lg font-medium tracking-tight text-white sm:text-center">
                  Ask Question
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input type="hidden" value={id} {...register("roomId")} />
                  <div className="mt-5 flex flex-col space-y-5">
                    <div>
                      <label
                        htmlFor="question"
                        className="block text-sm font-medium text-white"
                      >
                        Question
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="question"
                          className="block w-full rounded-md border-0 bg-slate-700 p-3 text-white focus:outline-none focus:ring-0 sm:text-sm"
                          rows={4}
                          {...register("question")}
                        ></textarea>
                        <p className="text-sm text-red-500">
                          {errors.question?.message}
                        </p>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {processing ? "Processing..." : "Submit Question"}
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

export default AskQuestionModal;
