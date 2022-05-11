import Link from "next/link";
import { FC } from "react";
import { InfoDialog } from "./InfoDialog";

export const Layout: FC = ({ children }) => {
  // const { user, session } = Auth.useUser();

  return (
    <div className="flex min-h-full min-w-full bg-slate-100">
      <div className="mx-auto flex min-h-full max-w-xl grow flex-col items-center justify-between">
        <header className="mt-2 w-full px-2 text-3xl font-extrabold">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a>DUELO</a>
            </Link>
            <div>
              <InfoDialog />
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
    // <div className="mx-auto flex h-screen max-w-3xl flex-col px-4 pt-3">
    //   {/* <header className="flex justify-between">
    //     <span className="flex-1">Worlde Arena</span>
    //     <span>Perfil</span>
    //     <span>Configuração</span>
    //   </header> */}
    //   {/* <span>{JSON.stringify(user, null, 2)}</span> */}
    //   <main className=" flex flex-grow flex-col">{children}</main>
    // </div>
  );
};
