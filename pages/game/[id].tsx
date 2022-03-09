import KeyboardWrapper from "../../components/KeyboardWrapper";
import { joinMatch, useGame, useMatch } from "~/lib/Store";
import { useContext, useEffect, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard/build/components/Keyboard";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Router, useRouter } from "next/router";
import { definitions } from "../../types/supabase";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { supabase } from "../../lib/Supabase";
import { Auth } from "../../components/Auth";

const WORD_SIZE = 5;
const NUMBER_OF_ATTEMPTS = 6;

const WaitingSecondPlayerScreen = () => {
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

const JoinMatchScreen = ({
  opponent,
  joinMatch,
}: {
  opponent: string;
  joinMatch: () => {};
}) => (
  <div className="flex flex-col items-center">
    <span>Partida contra {opponent}</span>
    <button onClick={joinMatch}>Entrar</button>
  </div>
);

const Page = () => {
  const router = useRouter();
  const { user } = Auth.useUser();
  const { match, isLoading, errorMessage } = useGame(router.query.id as string);

  console.log({ match, isLoading, errorMessage });

  const keyboardRef = useRef<typeof Keyboard | null>(null);

  const [gameOver, setGameOver] = useState(false);
  const [inputs, setInputs] = useState([""]);

  if (isLoading) {
    return <div>Carregando partida...</div>;
  }

  if (errorMessage) {
    return (
      <div>
        <h1>Erro!</h1>
        <div>{errorMessage}</div>
      </div>
    );
  }

  if (!match || !user) {
    return null;
  }

  const myBoard =
    user.id === match.board1?.playerId ? match.board1 : match.board2;

  if (!match.board2Id) {
    if (user.id === match.board1?.playerId) {
      return <WaitingSecondPlayerScreen />;
    } else {
      return (
        <JoinMatchScreen
          opponent={match.board1?.player.username!}
          joinMatch={async () => {
            await joinMatch(user.id, match.id);
            router.reload();
          }}
        />
      );
    }
  }

  const onKeyPress = async (key: string) => {
    if (gameOver) {
      return;
    }

    const currentRow = inputs.length - 1;

    if (key === "{backspace}") {
      const newInput = inputs[currentRow].slice(0, -1);
      setInputs([...inputs.slice(0, -1), newInput]);
    } else if (key === "{enter}") {
      if (inputs[currentRow].length !== WORD_SIZE) {
        console.log(`Só palavras com ${WORD_SIZE} letras`);
      } else {
        const wordExists = true;
        if (wordExists) {
          if (currentRow + 1 === NUMBER_OF_ATTEMPTS) {
            setGameOver(true);
          } else {
            setInputs([...inputs, ""]);
          }

          const { data } = await supabase
            .from<definitions["boards"]>("boards")
            .update({
              guesses: inputs,
            })
            .match({ id: myBoard?.id });
          console.log({ update: data });

          // const { body: results } = await supabase
          //   .from<definitions["matches"]>("matches")
          //   .update({
          //     [`player${user.id === match.player1 ? 1 : 2}Guesses`]: inputs,
          //   })
          //   .match({ id: match.id });
          // console.log(results?.[0]);
        } else {
          console.log("Palavra inválida");
        }
      }
    } else {
      const newInput = (inputs[currentRow] + key).slice(0, WORD_SIZE);
      setInputs([...inputs.slice(0, -1), newInput]);
    }
  };

  const Verdict = {
    UNKNOWN: "unknown",
    WRONG: "wrong",
    MISSPLACED: "missplaced",
    CORRECT: "correct",
  };

  const opponentGuesses =
    user.id === match.board1?.playerId
      ? match.board2?.guesses
      : match.board1?.guesses;

  const maskGuess = (guess: string) => {
    let maskedGuessArray: string[] = new Array(match.answer.length).fill(
      Verdict.WRONG
    );

    let remainingRightLetters = "";
    for (let i = 0; i < guess.length; i++) {
      if (match.answer[i] === guess[i]) {
        maskedGuessArray[i] = Verdict.CORRECT;
      } else {
        remainingRightLetters += match.answer[i];
      }
    }

    for (let i = 0; i < guess.length; i++) {
      if (
        match.answer[i] !== guess[i] &&
        remainingRightLetters.includes(guess[i])
      ) {
        remainingRightLetters = remainingRightLetters.replace(guess[i], "");
        maskedGuessArray[i] = Verdict.MISSPLACED;
      }
    }

    return maskedGuessArray;
  };

  const maskGuessWithEmoji = (guess: string) => {
    const maskedGuessArray = maskGuess(guess);
    let result: string[] = [];

    for (let i = 0; i < guess.length; i++) {
      if (maskedGuessArray[i] === Verdict.WRONG) {
        result.push("⬛");
      } else if (maskedGuessArray[i] === Verdict.MISSPLACED) {
        result.push("🟨");
      } else if (maskedGuessArray[i] === Verdict.CORRECT) {
        result.push("🟩");
      } else {
        result.push("⬜️");
      }
    }

    return result;
  };

  return (
    <div>
      <div className="flex justify-center">{`${user?.email} VS `}</div>
      <div className="flex">
        <span>Seu oponente:</span>
        <div style={{ fontSize: "10px" }}>
          {[...new Array(NUMBER_OF_ATTEMPTS)].map((_, i) => (
            <div key={i} className="leading-3">
              {opponentGuesses?.[i]
                ? maskGuessWithEmoji(opponentGuesses[i])
                : new Array(match.answer.length).fill("⬜️").join("")}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-400 space-y-3">
        {[...new Array(NUMBER_OF_ATTEMPTS)].map((_, i) => (
          <div key={i} className="flex flex-row justify-around">
            {[
              [...new Array(WORD_SIZE)].map((_, j) => (
                <div
                  key={`${i}-${j}`}
                  className="bg-gray-600 w-10 flex justify-center"
                >
                  {inputs[i] ? inputs[i][j] ?? "\u00A0" : "\u00A0"}
                </div>
              )),
            ]}
          </div>
        ))}
      </div>
      <div>
        <KeyboardWrapper
          onKeyPress={onKeyPress}
          keyboardRef={(r) => (keyboardRef.current = r)}
          newLineOnEnter
        />
      </div>
    </div>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  // TODO: allow spectator
  if (!user) {
    const callback = encodeURI(`game/${query.id}`);
    console.log(callback);

    return {
      props: {},
      redirect: {
        destination: `/auth?callback=${callback}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
