import { useRouter } from "next/router";
import { Layout } from "../components/Layout";
import { Button } from "../components/Button";

const Page = () => {
  const router = useRouter();

  const toPractice = () => {
    router.push("/solo/");
  };

  return (
    <Layout>
      <main className="flex w-full max-w-md grow flex-col items-center justify-center px-12">
        <Button size="large" disabled>
          Jogar online ⚔️
        </Button>
        <div className="border-1 absolute ml-48 mb-8 -rotate-12 border-2 border-dotted border-orange-400 bg-orange-100 px-6 py-1 font-bold uppercase text-orange-400">
          Vem aí
        </div>
        <Button size="large" className="mt-6" onClick={toPractice}>
          Praticar 💪
        </Button>
      </main>
    </Layout>
  );
};

export default Page;
