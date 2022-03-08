import { useState, useEffect } from "react";
import { getRandomAnswer } from "./Dictionary";
import { definitions } from "../types/supabase";
import { supabase } from "./Supabase";
import { useQuery } from "react-query";

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

const getMatch = async (matchId: string) => {
  try {
    const { data, error } = await supabase
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

    if (error) {
      if (error.code === "22P02") {
        return { error: { ...error, message: "Partida não encontrada" } };
      } else {
        return { error };
      }
    } else {
      return { data: data?.[0] };
    }
  } catch (error) {
    return { error: { message: "Erro desconhecido" } };
  }
};

const useBoard = (boardId: string) => {
  const [board, setBoard] = useState<definitions["boards"]>();

  useEffect(() => {
    if (!boardId) {
      return;
    }

    const boardListener = supabase
      .from<definitions["boards"]>(`boards:id=eq.${boardId}`)
      .on("UPDATE", (payload) => setBoard(payload.new))
      .subscribe();

    return () => {
      boardListener.unsubscribe();
    };
  }, [boardId]);

  return board;
};

export const useGame = (matchId: string) => {
  const [match, setMatch] = useState<Match>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [shouldFetchMatch, setShouldFetchMatch] = useState(true);

  useEffect(() => {
    if (!matchId) {
      return;
    }

    const matchListener = supabase
      .from<definitions["matches"]>(`matches:id=eq.${matchId}`)
      .on("UPDATE", () => setShouldFetchMatch(true))
      .subscribe();

    return () => {
      matchListener.unsubscribe();
    };
  }, [matchId]);

  useEffect(() => {
    if (!match?.board1Id) {
      return;
    }

    const board1Listener = supabase
      .from<definitions["boards"]>(`boards:id=eq.${match.board1Id}`)
      .on("UPDATE", () => setShouldFetchMatch(true))
      .subscribe();

    return () => {
      board1Listener.unsubscribe();
    };
  }, [match?.board1Id]);

  useEffect(() => {
    if (!match?.board2Id) {
      return;
    }

    const board2Listener = supabase
      .from<definitions["boards"]>(`boards:id=eq.${match.board2Id}`)
      .on("UPDATE", async () => await {

        // setShouldFetchMatch(true)
      })
      .subscribe();

    return () => {
      board2Listener.unsubscribe();
    };
  }, [match?.board2Id]);

  useEffect(() => {
    if (!shouldFetchMatch) {
      return;
    }

    (async () => {
      setIsLoading(true);
      setErrorMessage(undefined);

      const { data, error } = await getMatch(matchId);

      setMatch(data);
      setIsLoading(false);
      setErrorMessage(error?.message);
      setShouldFetchMatch(false);
    })();
  }, [shouldFetchMatch]);

  return { match, isLoading, errorMessage };
};

export const useMatch = (matchId: string) => {
  const [match, setMatch] = useState<Match>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<string>();

  const [shouldRefetchMatch, setShouldRefetchMatch] = useState(false);

  useEffect(() => {
    if (!matchId) {
      return;
    }

    // i guess the problem never was the spread, but this nigga here
    const matchListener = supabase
      .from<definitions["matches"]>(`matches:id=eq.${matchId}`)
      .on("UPDATE", (payload) => {
        setShouldRefetchMatch(true);
        // console.log("match upd");
        // let updatedMatch = match;
        // console.log("try upd");
        // if (updatedMatch) {
        //   console.log("upd");
        //   updatedMatch.board2Id = payload.new.board2Id;
        //   return setMatch(updatedMatch);
        // }
        // return setMatch({ ...match!, ...payload.new });
      })
      .subscribe();

    const board1Listener = supabase
      .from<definitions["boards"]>(`boards:id=eq.${match?.board1Id}`)
      .on("UPDATE", (payload) => {
        setShouldRefetchMatch(true);
        // let updatedMatch = match;
        // console.log("try board1 upd");
        // if (updatedMatch?.board1) {
        //   console.log("board1 upd");
        //   updatedMatch.board1.guesses = payload.new.guesses;
        //   return setMatch(updatedMatch);
        // }
      })
      .subscribe();

    const board2Listener = supabase
      .from<definitions["boards"]>(`boards:id=eq.${match?.board2Id}`)
      .on("UPDATE", (payload) => {
        setShouldRefetchMatch(true);
        // let updatedMatch = match;
        // console.log("try board2 upd");
        // let updatedMatch = match;

        // // if (updatedMatch) {
        // //   updatedMatch.board2 = payload.new
        // // }

        // if (updatedMatch?.board2) {
        //   console.log("board2 upd");
        //   updatedMatch.board2.guesses = payload.new.guesses;
        //   return setMatch(updatedMatch);
        // }
      })
      .subscribe();

    return () => {
      matchListener.unsubscribe();
      board1Listener.unsubscribe();
      board2Listener.unsubscribe();
    };
  }, [matchId, match?.board1Id, match?.board2Id]);

  useEffect(() => {
    (async () => {
      setIsError(undefined);
      setIsLoading(true);
      try {
        console.log("try upd all");
        const { data, error } = await supabase
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

        setMatch(data?.[0]);

        if (error) {
          console.log(error);

          if (error.code === "22P02") {
            setIsError("Partida não encontrada");
          } else {
            setIsError(error.message);
          }
        }
      } catch (err) {
        console.error(err);
        setIsError("Erro desconhecido");
      } finally {
        setIsLoading(false);
        setShouldRefetchMatch(false);
      }
    })();
  }, [matchId, match?.board1Id, match?.board2Id, shouldRefetchMatch]);

  return {
    match,
    isLoading,
    isError,
  };
};

export const fetchUser = async (
  userId: string,
  setState: Function
): Promise<definitions["users"] | undefined> => {
  try {
    const { body } = await supabase
      .from<definitions["users"]>("users")
      .select(`*`)
      .eq("id", userId);
    const user = body?.[0];
    if (setState) setState(user);
    return user;
  } catch (error) {
    console.log("error", error);
  }
};

export const fetchUserRoles = async (
  setState: Function
): Promise<definitions["user_roles"][] | null | undefined> => {
  try {
    const { body } = await supabase
      .from<definitions["user_roles"]>("user_roles")
      .select(`*`);
    if (setState) setState(body);
    return body;
  } catch (error) {
    console.log("error", error);
  }
};

const createBoard = async (
  userId: string
): Promise<definitions["boards"] | undefined> => {
  const { data } = await supabase.from<definitions["boards"]>("boards").insert({
    playerId: userId,
  });

  return data?.[0];
};

export const createMatch = async (
  userId: string
): Promise<definitions["matches"] | undefined> => {
  const board1 = await createBoard(userId);

  const { data } = await supabase
    .from<definitions["matches"]>("matches")
    .insert({
      board1Id: board1?.id,
      answer: getRandomAnswer(),
    });
  return data?.[0];
};

export const joinMatch = async (
  userId: string,
  matchId: string
): Promise<definitions["matches"] | undefined> => {
  const board2 = await createBoard(userId);

  console.log({ userId, matchId, board2 });

  const { data } = await supabase
    .from<definitions["matches"]>("matches")
    .update({
      board2Id: board2?.id,
      startTime: new Date().toISOString(),
    })
    .match({ id: matchId });

  return data?.[0];
};

// export const startMatchmaking = async (
//   userId: string
// ): Promise<definitions["matches"] | undefined> => {
//   console.log(`1. Starting matchmaking for ${userId}`);
//   if (!userId) {
//     return undefined;
//   }

//   try {
//     const { data: availableMatch } = await supabase
//       .from<definitions["matches"]>("matches")
//       .select("*")
//       .neq("player1", userId)
//       .is("player2", null)
//       .order("id", { ascending: false })
//       .limit(1)
//       .single();

//     if (availableMatch) {
//       // join match
//       console.log(`2. Joining match: `, { availableMatch });
//       const { body } = await supabase
//         .from<definitions["matches"]>("matches")
//         .update({ player2: userId })
//         .eq("id", availableMatch.id);
//       return body?.[0];
//     } else {
//       // create match
//       console.log(`2. Creating new match`);
//       return createMatch(userId);
//     }
//   } catch (error) {
//     console.log("error", error);
//   }
// };

export const cancelMatchmaking = async (
  matchId: string | undefined
): Promise<definitions["matches"] | undefined> => {
  if (!matchId) {
    return undefined;
  }

  try {
    const { body } = await supabase
      .from<definitions["matches"]>("matches")
      .delete()
      .match({ id: matchId });
    return body?.[0];
  } catch (error) {
    console.log("error", error);
  }
};
