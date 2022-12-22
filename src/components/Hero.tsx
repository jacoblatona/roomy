import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <div className="mx-auto -mt-14 flex min-h-[calc(100vh-100px)] max-w-3xl flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-center sm:text-6xl">
        <span className="text-indigo-400"> Conversations</span> that power the
        internet.
      </h1>
      <p className="mt-6 text-lg leading-8 text-white/50 sm:text-center">
        Roomy is a platform for anybody to create a room and discuss just about
        anything. Make your first room and build a community with like-minded
        people!
      </p>
      <div className="mt-8 flex gap-x-4 sm:justify-center">
        <a
          href="#"
          className="inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700"
        >
          Create your first room
          <span className="text-indigo-200" aria-hidden="true">
            &rarr;
          </span>
        </a>
        <Link href="/rooms">
          <span className="inline-block rounded-lg bg-white/10 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-0">
            Browse Rooms
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
