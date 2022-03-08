import { createMatch } from "../lib/Store";
import { useRouter } from "next/router";
import { Auth } from "../components/Auth";
import { supabase } from "../lib/Supabase";

const Page = () => {
  const router = useRouter();
  const { user } = Auth.useUser();

  const handleRankedMatch = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }
  };

  const handleFriendlyMatch = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }

    const match = await createMatch(user.id);
    // TODO: use short match id
    router.push(`/match/${match?.id}`);
  };

  const handleSignOut = async () => {
    router.push("/signOut");
  };

  const handleSignIn = () => {
    router.push("/auth");
  };

  return (
    <div className="flex flex-col flex-grow justify-center items-center">
      <button onClick={handleRankedMatch}>Encontrar partida</button>
      <button onClick={handleFriendlyMatch}>Jogar com um amigo</button>
      {user ? (
        <button onClick={handleSignOut}>Sair</button>
      ) : (
        <button onClick={handleSignIn}>Entrar</button>
      )}
    </div>
  );
};

export default Page;
