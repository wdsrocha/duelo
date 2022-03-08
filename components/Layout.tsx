import { Auth } from "../components/Auth";
import { FC } from "react";

export const Layout: FC = ({ children }) => {
  // const { user, session } = Auth.useUser();

  return (
    <div className="mx-auto max-w-3xl flex flex-col h-screen pt-3 px-4">
      {/* <header className="flex justify-between">
        <span className="flex-1">Worlde Arena</span>
        <span>Perfil</span>
        <span>Configuração</span>
      </header> */}
      {/* <span>{JSON.stringify(user, null, 2)}</span> */}
      <main className=" flex flex-col flex-grow">{children}</main>
    </div>
  );
};
