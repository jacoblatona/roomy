import Header from "./Header";
import CreateRoomModal from "./modals/CreateRoomModal";
import LoginModal from "./modals/LoginModal";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <main className="relative min-h-screen bg-gradient-to-b from-slate-700 to-slate-900">
        <Header />
        {children}

        {/* MODALS */}
        <LoginModal />
        <CreateRoomModal />
      </main>
    </>
  );
}
