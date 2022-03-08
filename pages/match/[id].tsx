import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/Supabase";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { User } from "@supabase/supabase-js";
import { definitions } from "../../types/supabase";
import { useRouter } from "next/router";
import { Auth } from "../../components/Auth";

type RawMatch = definitions["matches"];
type RawBoard = definitions["boards"];

interface Board extends RawBoard {
  player: definitions["users"];
}

interface Match extends RawMatch {
  winner?: definitions["users"];
  board1?: Board;
  board2?: Board;
}

const WaitingPlayerScreen = () => {
  const [isInviteLinkCopied, setIsInviteLinkCopied] = useState(false);

  const handleCopyInviteLink = () => {
    setIsInviteLinkCopied(true);
    setTimeout(() => setIsInviteLinkCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center">
      <span>Aguardando o segundo jogador</span>
      <CopyToClipboard
        text={window.location.href}
        onCopy={handleCopyInviteLink}
      >
        <button>Convidar</button>
      </CopyToClipboard>
      {isInviteLinkCopied ? <span>Link copiado!</span> : null}
    </div>
  );
};

const shouldDisplayWaitingPlayerScreen = (match: Match) => {
  const { user } = Auth.useUser();

  return user?.id === match.board1?.playerId && !match.startTime;
};

const createBoard = async (
  userId: string
): Promise<definitions["boards"] | undefined> => {
  const { data } = await supabase.from<definitions["boards"]>("boards").insert({
    playerId: userId,
  });

  return data?.[0];
};

const joinGame = async (
  userId: string,
  matchId: string
): Promise<definitions["matches"] | undefined> => {
  const board2 = await createBoard(userId);

  const { data } = await supabase
    .from<definitions["matches"]>("matches")
    .update({
      board2Id: board2?.id,
      startTime: new Date().toISOString(),
    })
    .match({ id: matchId });

  return data?.[0];
};

const JoinGameScreen = ({ game }: { game: Game }) => {
  const { user } = Auth.useUser();

  return (
    <div>
      <span>Partida contra {game.board1?.player.username}</span>
      <button onClick={() => joinGame(user?.id!, game.id)}>Jogar</button>
    </div>
  );
};

const shouldDisplayJoinGameScreen = (game: Game) => {
  const { user } = Auth.useUser();

  return user?.id !== game.board1?.playerId && !game.startTime;
};

const fetchGame = async (matchId: string, setGame: any) => {
  try {
    const { data } = await supabase
      .from<definitions["matches"]>("matches")
      .select(
        `
            *,
            winner:winnerId (*),
            board1:board1Id (
              *,
              player:boards_playerId_fkey (*)
            ),
            board2:board2Id (
              *,
              player:boards_playerId_fkey (*)
            )
          `
      )
      .match({ id: matchId });
    setGame(data?.[0]);
  } catch (error) {
    console.error(error);
  }
};

type Game = Match;

const listenBoard = (
  matchId: string,
  boardId: number | undefined,
  setGame: any
) => {
  useEffect(() => {
    if (!boardId) {
      return;
    }

    const boardListener = supabase
      .from<definitions["boards"]>(`boards:id=eq.${boardId}`)
      .on("UPDATE", async () => await fetchGame(matchId, setGame))
      .subscribe();

    return () => {
      boardListener.unsubscribe();
    };
  }, [boardId]);
};

const useGame = (matchId: string) => {
  const [game, setGame] = useState<Game>();

  listenBoard(matchId, game?.board1Id, setGame);
  listenBoard(matchId, game?.board2Id, setGame);

  useEffect(() => {
    fetchGame(matchId, setGame);

    const matchListener = supabase
      .from<definitions["matches"]>(`matches:id=eq.${matchId}`)
      .on("UPDATE", async () => await fetchGame(matchId, setGame))
      .subscribe();

    return () => {
      matchListener.unsubscribe();
    };
  }, []);

  return { game };
};

const Page = () => {
  const router = useRouter();
  // const { user } = Auth.useUser();
  const { game } = useGame(router.query.id as string);

  if (!game) {
    return <div>Partida não encontrada</div>;
  }

  if (shouldDisplayWaitingPlayerScreen(game)) {
    return <WaitingPlayerScreen />;
  }

  if (shouldDisplayJoinGameScreen(game)) {
    return <JoinGameScreen game={game} />;
  }

  return <div>oi</div>;
};

export default Page;

// export const getServerSideProps: GetServerSideProps = async ({
//   query,
//   req,
// }) => {
//   const { user } = await supabase.auth.api.getUserByCookie(req);

//   // TODO: allow spectator
//   if (!user) {
//     const callback = encodeURI(`game/${query.id}`);
//     console.log(callback);

//     return {
//       props: {},
//       redirect: {
//         destination: `/auth?callback=${callback}`,
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };
