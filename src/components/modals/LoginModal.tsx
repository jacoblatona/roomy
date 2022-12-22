import { Fragment, MutableRefObject, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAtom } from "jotai";
import { isLoginModalOpenAtom } from "../../atoms/modals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord,
  faTwitch,
  faTwitter,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { signIn } from "next-auth/react";

interface AuthOption {
  name: string;
  icon: IconDefinition;
}

const AuthOptions = [
  { name: "Discord", icon: faDiscord },
  { name: "Twitch", icon: faTwitch },
  { name: "Twitter", icon: faTwitter },
  { name: "Github", icon: faGithub },
];

const LoginModal: React.FC = () => {
  const [open, setOpen] = useAtom(isLoginModalOpenAtom);
  const cancelButtonRef = useRef(null);
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-800 px-4 pt-5 pb-4 text-left transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-8">
                <h1 className="text-md font-medium tracking-tight text-white sm:text-center">
                  Sign in with
                </h1>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {AuthOptions.map((option: AuthOption) => (
                    <div
                      key={option.name}
                      className="flex cursor-pointer items-center justify-center gap-3 rounded-md border border-slate-700 p-3 font-medium text-white"
                      onClick={() => signIn(option.name.toLowerCase())}
                    >
                      <FontAwesomeIcon
                        icon={option.icon}
                        className="w-5 text-white"
                      />
                      {option.name}
                    </div>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default LoginModal;
