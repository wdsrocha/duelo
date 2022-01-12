import UserContext from "~/lib/UserContext";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { startMatchmaking, cancelMatchmaking, useStore } from "../lib/Store";

const Page = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [matchId, setMatchId] = useState<string>();
  const { match } = useStore({ matchId });

  useEffect(() => {
    if (!user) {
      return;
    }

    (async () => {
      const [result] = await startMatchmaking(user.id);

      if (result.player1 && result.player2) {
        router.push(`/game/${result.id}`);
      }

      setMatchId(result.id);
    })();

    return;
  }, []);

  useEffect(() => {
    if (!match) {
      return;
    }

    if (match.player1 && match.player2) {
      router.push(`/game/${match.id}`);
    }
  }, [match]);

  return (
    <div className="flex flex-col flex-grow justify-center items-center">
      <div>Procurando partida...</div>
      <Link href="/menu">
        <a onClick={() => cancelMatchmaking(matchId)}>Cancelar</a>
      </Link>
    </div>
  );
};

export default Page;
