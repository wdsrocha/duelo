import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { getRandomAnswer } from "./Dictionary";
import { parseBody } from "next/dist/server/api-utils";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_KEY ?? ""
);

interface Props {
  matchId?: string;
}

/**
 * @param {number} channelId the currently selected Channel
 */
export const useStore = ({ matchId }: Props) => {
  const [updatedMatch, handleUpdatedMatch] = useState();
  const [match, setMatch] = useState<any>();

  useEffect(() => {
    if (!matchId) {
      return;
    }

    const matchListener = supabase
      .from(`matches:id=eq.${matchId}`)
      .on("UPDATE", (payload) => {
        console.log(`Received update for match: ${matchId}`);
        console.log(`Payload:`, payload.new);
        return handleUpdatedMatch(payload.new);
      })
      .subscribe();

    console.log({ matchListener });

    return () => {
      matchListener.unsubscribe();
    };
  }, [matchId]);

  useEffect(() => {
    if (updatedMatch) {
      setMatch(updatedMatch);
    }
  }, [updatedMatch]);

  return {
    match,
  };
};

export const fetchUser = async (userId: number, setState: Function) => {
  try {
    const { body } = await supabase.from("users").select(`*`).eq("id", userId);
    const user = body?.[0];
    if (setState) setState(user);
    return user;
  } catch (error) {
    console.log("error", error);
  }
};

export const fetchUserRoles = async (setState: Function) => {
  try {
    const { body } = await supabase.from("user_roles").select(`*`);
    if (setState) setState(body);
    return body;
  } catch (error) {
    console.log("error", error);
  }
};

export const startMatchmaking = async (userId: string): Promise<any> => {
  console.log(`1. Starting matchmaking for ${userId}`);
  if (!userId) {
    return {};
  }

  try {
    const { data: availableMatch } = await supabase
      .from("matches")
      .select("*")
      .neq("player1", userId)
      .is("player2", null)
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (availableMatch) {
      // join match
      console.log(`2. Joining match: `, { availableMatch });
      const { body } = await supabase
        .from("matches")
        .update({ player2: userId })
        .eq("id", availableMatch.id);
      return body;
    } else {
      // create match
      console.log(`2. Creating new match`);
      const { body } = await supabase.from("matches").insert({
        player1: userId,
        word: getRandomAnswer(),
      });
      return body;
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const cancelMatchmaking = async (matchId: string | undefined) => {
  if (!matchId) {
    return {};
  }

  try {
    const { body } = await supabase
      .from("matches")
      .delete()
      .match({ id: matchId });
    return body;
  } catch (error) {
    console.log("error", error);
  }
};
