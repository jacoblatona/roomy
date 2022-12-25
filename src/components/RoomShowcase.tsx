import Link from "next/link";
import { type IRoom } from "../types";

type RoomProps = {
  room: IRoom;
};

export const RoomShowcase: React.FC<RoomProps> = ({ room }: RoomProps) => {
  const tags = room.tags ? JSON.parse(`${room.tags}`) : undefined;
  return (
    <li className="col-span-1 divide-y divide-slate-600 rounded-lg bg-slate-700 shadow">
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="truncate font-medium text-white">{room.name}</h3>
          </div>
          <p className="mt-1 truncate text-sm text-white/50">
            {room.description}
          </p>
          <div className="flex gap-2">
            {tags?.map((tag: string) => (
              <span
                key={tag}
                className="mt-2 inline-block flex-shrink-0 rounded-full bg-slate-600 px-2 py-0.5 text-xs font-medium text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <img
          className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
          src={room.creator.image as string}
          alt=""
        />
      </div>
      <Link href={`/rooms/${room.id}`}>
        <div className="flex w-full justify-between border-t border-slate-600 py-4 px-5 text-center text-white">
          <div className="flex items-center gap-7">
            <div className="flex items-center gap-2">
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
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
              {room.participants.length}
            </div>
            <div className="flex items-center gap-2">
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
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
              {room.questions.length}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Enter Room</span>
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
                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
              />
            </svg>
          </div>
        </div>
      </Link>
    </li>
  );
};
