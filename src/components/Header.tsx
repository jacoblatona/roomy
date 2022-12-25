import { useAtom } from "jotai";
import { isLoginModalOpenAtom, isRoomModalOpenAtom } from "../atoms";
import { useSession } from "next-auth/react";
import UserDropdown from "./UserDropdown";
import Link from "next/link";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment, useState } from "react";

const navLinks = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Browse",
    path: "/rooms",
  },
];

const Header: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useAtom(isLoginModalOpenAtom);
  const [isRoomModalOpen, setIsRoomModalOpen] = useAtom(isRoomModalOpenAtom);
  const [isSidenavOpen, setIsSidenavOpen] = useState<boolean>(false);
  const { data: sessionData } = useSession();
  return (
    <>
      <header className="py-6">
        <nav className="mx-auto flex max-w-xs items-center justify-between lg:container">
          <div className="flex items-center gap-3">
            <Link href="/">
              <img src="/images/logo.png" alt="Logo" className="w-14" />
            </Link>
            <div className="ml-10 hidden space-x-8 text-base font-medium text-white md:flex">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.path}>
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 font-medium lg:gap-8">
            {sessionData ? (
              <UserDropdown
                image={sessionData.user?.image as string}
                name={sessionData.user?.name as string}
              />
            ) : (
              <span
                onClick={() => setIsLoginModalOpen(!isLoginModalOpen)}
                className="text-medium text-md cursor-pointer text-white"
              >
                Sign in
              </span>
            )}
            <button
              onClick={() => setIsRoomModalOpen(!isRoomModalOpen)}
              type="button"
              className="hidden items-center justify-center gap-3 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:border-none focus:outline-none focus:ring-0 md:inline-flex "
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
                  d="M12 6v12m6-6H6"
                />
              </svg>
              Create Room
            </button>
            <div
              className="lg:hidden"
              onClick={() => setIsSidenavOpen(!isSidenavOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-8 w-8 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </div>
          </div>
        </nav>
      </header>

      <Transition.Root show={isSidenavOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsSidenavOpen}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-slate-800 py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            <Link href="/">
                              <img
                                src="/images/logo.png"
                                alt="Logo"
                                className="w-10"
                              />
                            </Link>
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md text-white focus:outline-none focus:ring-0 focus:ring-offset-0"
                              onClick={() => setIsSidenavOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>X
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="absolute inset-0 px-4 sm:px-6">
                          <div className="h-full pt-20" aria-hidden="true">
                            <div className="flex flex-col gap-y-10 text-center">
                              {navLinks.map((link) => (
                                <Link href={link.path} key={link.name}>
                                  <span className="text-md text-3xl font-semibold text-white">
                                    {link.name}
                                  </span>
                                </Link>
                              ))}
                              <button
                                onClick={() =>
                                  setIsRoomModalOpen(!isRoomModalOpen)
                                }
                                type="button"
                                className="inline-flex w-full items-center justify-center rounded-md  bg-indigo-600 py-4 font-bold text-white "
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
                                    d="M12 6v12m6-6H6"
                                  />
                                </svg>
                                Create Room
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default Header;
