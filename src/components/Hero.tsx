import Link from "next/link";
import { isRoomModalOpenAtom } from "../atoms";
import { useAtom } from "jotai";

const Hero: React.FC = () => {
  const [open, setOpen] = useAtom(isRoomModalOpenAtom);
  return (
    <div className="mx-auto -mt-14 flex min-h-[calc(100vh-100px)] max-w-xs flex-col items-center justify-center gap-6 px-4 py-16 text-center lg:max-w-3xl">
      <h1 className="text-5xl font-bold tracking-tight text-white sm:text-center sm:text-6xl lg:text-6xl">
        <span className="text-indigo-400"> Conversations</span> that power the
        internet.
      </h1>
      <p className="text-md mt-6 leading-8 text-white/50 sm:text-center lg:text-lg">
        Roomy is a platform for anybody to create a room and host a Q&A with
        other users. Make your first room and build a community you can guide
        and mentor!
      </p>
      <div className="mt-8 flex flex-col gap-x-4 gap-y-5 sm:justify-center lg:flex-row lg:gap-y-0">
        <button
          onClick={() => setOpen(!open)}
          type="button"
          className="inline-block w-full rounded-lg bg-indigo-600 px-4 py-3 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 lg:w-auto lg:py-1.5"
        >
          Create your first room
          <span className="text-indigo-200" aria-hidden="true">
            &rarr;
          </span>
        </button>
        <Link href="/rooms">
          <span className="inline-block w-full rounded-lg bg-white/10 px-4 py-3 text-base font-semibold leading-7 text-white shadow-sm ring-0 lg:w-auto lg:py-1.5">
            Browse Rooms
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
