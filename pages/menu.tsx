import { forwardRef, MouseEventHandler, ReactNode, useContext } from "react";
import UserContext from "~/lib/UserContext";
import Link from "next/link";

interface MenuButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
}

const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ onClick, children }, ref) => {
    return (
      <button onClick={onClick} ref={ref}>
        -{children}-
      </button>
    );
  }
);

const Page = () => {
  const { user, authLoaded, signOut } = useContext(UserContext);

  return (
    <div className="flex flex-col flex-grow justify-center items-center">
      <Link href="/matchmaking">
        <a>Encontrar partida</a>
      </Link>
      <Link href="/">
        <a onClick={signOut}>Sair</a>
      </Link>
    </div>
  );
};

export default Page;
