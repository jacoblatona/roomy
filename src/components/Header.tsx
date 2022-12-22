import { useAtom } from "jotai";
import { isLoginModalOpenAtom, isRoomModalOpenAtom } from "../atoms/modals";
import { useSession } from "next-auth/react";
import UserDropdown from "./UserDropdown";

const Header: React.FC = () => {
  const [open, setOpen] = useAtom(isLoginModalOpenAtom);
  const [openAlt, setOpenAlt] = useAtom(isRoomModalOpenAtom);
  const { data: sessionData } = useSession();
  return (
    <header className="py-6">
      <nav className="container mx-auto flex items-center justify-between">
        <img src="/images/logo.png" alt="Logo" className="w-14" />
        <div className="flex items-center gap-8 font-medium">
          {sessionData ? (
            <UserDropdown
              image={sessionData.user?.image as string}
              name={sessionData.user?.name as string}
            />
          ) : (
            <span
              onClick={() => setOpen(!open)}
              className="text-medium text-md cursor-pointer text-white/50"
            >
              Sign in
            </span>
          )}
          <button
            onClick={() => setOpenAlt(!openAlt)}
            type="button"
            className="inline-flex items-center justify-center gap-3 rounded-full border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:border-none focus:outline-none focus:ring-0 "
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
      </nav>
    </header>
  );
};

export default Header;
