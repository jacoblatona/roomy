import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";

type Props = {
  image: string;
  name: string;
};

const UserDropdown: React.FC<Props> = ({ image, name }: Props) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full items-center justify-center gap-3 rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-0">
          <img src={image} alt="User Avatar" className="h-8 w-8 rounded-full" />
          <span className="text-medium text-md cursor-pointer text-white">
            {name}
          </span>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-slate-700 ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              <a href="#" className="block px-4 py-2 text-sm text-white">
                Account settings
              </a>
            </Menu.Item>
            <Menu.Item>
              <span
                onClick={() => signOut()}
                className="block cursor-pointer px-4 py-2 text-sm text-white"
              >
                Sign Out
              </span>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserDropdown;
