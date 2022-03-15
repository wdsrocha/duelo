import { Board } from "../components/board/Board";
import {} from "./../components/board/Row";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Keyboard } from "../components/keyboard/Keyboard";
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

  const getVerdictByUsedLetter = (guesses: string[], solution: string) => {
    const verdictByLetter: Record<string, Verdict> = {};

    guesses.forEach((guess) => {
      guess.split("").forEach((letter, i) => {
        if (!solution.includes(letter)) {
          verdictByLetter[letter] = "absent";
        } else if (letter === solution[i]) {
          verdictByLetter[letter] = "correct";
        } else if (verdictByLetter[letter] !== "correct") {
          verdictByLetter[letter] = "present";
        }
      });
    });

    return verdictByLetter;
  };

  const verdictByUsedLetter = getVerdictByUsedLetter(guesses, solution);

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
    const message = isVictory()
      ? `Acertei a palavra ${solution} (${guesses.length}/6) em pvp.wesley.works`
      : `Errei a palavra ${solution} em pvp.wesley.works`;

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

    return `${message}\n\n${sharableBoard}`;
  };

  return (
    <div className="flex min-h-full min-w-full bg-slate-100">
      <div className="mx-auto flex min-h-full max-w-xl grow flex-col items-center justify-between">
        <header className="mt-2 text-3xl font-extrabold">
          <Link href="/">
            <a>TERMONLINE</a>
          </Link>
          <span></span>
        </header>
        <main className="w-full max-w-md  px-12">
          <Board
            guesses={guesses}
            currentGuess={currentGuess}
            solution={solution}
          />
          <GameOverDialog
            won={isVictory()}
            open={isGameOverDialogOpen}
            onOpenChange={setIsGameOverDialogOpen}
            onPlayAgain={router.reload}
            solution={solution}
            getShareText={getShareText}
          />
        </main>
        <footer className="w-full px-2 pb-2">
          <Keyboard
            guesses={guesses}
            solution={solution}
            onKeyPress={onKeyPress}
          />
        </footer>
      </div>
    </div>
  );
}

export default Page;

// tworm.ooo
// doism.ooo
// dueto
// termo
