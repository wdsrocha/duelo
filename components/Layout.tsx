import { FC, useContext } from "react";
import UserContext from "~/lib/UserContext";

export const Layout: FC = ({ children }) => {
  const { signOut, user, userRoles } = useContext(UserContext);

  return (
    <div className="mx-auto max-w-3xl flex flex-col h-screen pt-3 px-4">
      <header className="flex">
        <span className="flex-1">Worlde Arena</span>
        <span>Perfil</span>
        <span>Configuração</span>
      </header>
      <main className="flex flex-grow">{children}</main>
    </div>
  );
};
