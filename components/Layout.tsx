import Link from "next/link";
import { FC } from "react";
import { InfoDialog } from "./InfoDialog";

export const Layout: FC = ({ children }) => {
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
  );
};
