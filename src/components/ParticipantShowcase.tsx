import { type IParticipant } from "../types";

type ParticipantProps = {
  participant: IParticipant;
};

export const ParticipantShowcase: React.FC<ParticipantProps> = ({
  participant,
}: ParticipantProps) => {
  return (
    <div className="flex w-full items-center gap-2 rounded-md p-2 py-3">
      <img
        src={participant.user?.image as string}
        className="h-9 w-9 rounded-full"
        alt="participant"
      />
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white">
          {participant.user?.name}
        </span>
        <span className="text-xs text-indigo-400">Member</span>
      </div>
    </div>
  );
};
