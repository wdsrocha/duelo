import { Board } from "../components/board/Board";
import {} from "./../components/board/Row";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Keyboard from "react-simple-keyboard/build/components/Keyboard";
import KeyboardWrapper from "../components/KeyboardWrapper";
import { GameOverDialog } from "../components/GameOverDialog";
import { useRouter } from "next/router";
import {
  getGuessVerdicts,
  getRandomSolution,
  isEqual,
  isValidWord,
  Verdict,
} from "../lib/utils";
import Link from "next/link";

function Page() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOverDialogOpen, setIsGameOverDialogOpen] = useState(false);
  // gameOver is needed because the game can end due to a disconnect on
  // multiplayer mode
  const [gameOver, setGameOver] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setSolution(getRandomSolution());
  }, []);

  useEffect(() => {
    setIsGameOverDialogOpen(gameOver);
  }, [gameOver]);

  const data = { guesses, currentGuess, gameOver, solution };

  const keyboardRef = useRef<typeof Keyboard | null>(null);

  const onKeyPress = async (key: string) => {
    if (gameOver) {
      return;
    }

    switch (key) {
      case "{enter}":
        if (currentGuess.length !== 5) {
          toast.error("Só palavras com 5 letras");
        } else {
          if (isValidWord(currentGuess)) {
            setGuesses([...guesses, currentGuess]);
            setCurrentGuess("");
            if (isEqual(currentGuess, solution) || guesses.length === 5) {
              setGameOver(true);
            }
          } else {
            toast.error("Não conheço essa palavra");
          }
        }
        break;

      case "{backspace}":
        setCurrentGuess(currentGuess.slice(0, -1));
        break;

      default:
        if (currentGuess.length < 5 && guesses.length < 6 && !gameOver) {
          setCurrentGuess(`${currentGuess}${key}`);
        }
        break;
    }
  };

  const isVictory = () =>
    guesses.length ? isEqual(guesses[guesses.length - 1], solution) : false;

  const getShareText = () => {
    const sharableBoard = guesses
      .map((guess) =>
        getGuessVerdicts(guess, solution)
          .map(
            (verdict) =>
              ({
                absent: "⬛",
                present: "🟨",
                correct: "🟩",
              }[verdict])
          )
          .join("")
      )
      .join("\n");

    return `${isVictory() ? "Acertei" : "Errei"} a palavra "${solution}" (${
      guesses.length
    }/6) em pvp.wesley.works\n\n${sharableBoard}`;
  };

  return (
    <div className="mx-auto max-w-7xl py-8 sm:px-6 lg:px-8">
      <header>
        <Link href="/">
          <a>Nome do Jogo Aqui </a>
        </Link>
        <span></span>
      </header>
      <main className="">
        <div>
          <Board
            guesses={guesses}
            currentGuess={currentGuess}
            solution={solution}
          />
        </div>
        <KeyboardWrapper
          onKeyPress={onKeyPress}
          keyboardRef={(ref) => (keyboardRef.current = ref)}
          newLineOnEnter
          physicalKeyboardHighlight={!gameOver}
        />
        {/* {JSON.stringify(data, null, 2)} */}
        <GameOverDialog
          won={isVictory()}
          open={isGameOverDialogOpen}
          onOpenChange={setIsGameOverDialogOpen}
          onPlayAgain={router.reload}
          solution={solution}
          getShareText={getShareText}
        />
      </main>
    </div>
  );
}

export default Page;
