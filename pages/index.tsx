import { useRouter } from "next/router";
import { Layout } from "../components/Layout";
import classNames from "classnames";

const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={classNames(
      className,
      "flex h-14 w-56 items-center justify-center rounded-md border bg-green-600 px-4 py-2 text-lg font-bold uppercase text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2  disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
    )}
  >
    {children}
  </button>
);

const Page = () => {
  const router = useRouter();

  return (
    <Layout>
      <main className="flex w-full max-w-md grow flex-col items-center justify-center px-12">
        <Button disabled>Jogar online ⚔️</Button>
        <div className="border-1 absolute ml-48 mb-8 -rotate-12 border-2 border-dotted border-orange-400 bg-orange-100 px-2 py-1 text-sm font-bold uppercase text-orange-400">
          Vem aí
        </div>
        <Button className="mt-4">Praticar 💪</Button>
      </main>
    </Layout>
  );
};

export default Page;
