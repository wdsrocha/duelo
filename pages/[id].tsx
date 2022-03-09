import classnames from "classnames";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import Keyboard from "react-simple-keyboard/build/components/Keyboard";
import KeyboardWrapper from "../components/KeyboardWrapper";
import { isValidWord, normalizedToOriginal } from "../lib/Dictionary";

type Verdict = "absent" | "present" | "correct";

const Cell = ({ value, verdict }: { value?: string; verdict?: Verdict }) => {
  const classes = classnames({
    "bg-white border-slate-200": !verdict,
    "border-black": value && !verdict,
    "bg-slate-400 text-white border-slate-400": verdict === "absent",
    "bg-green-500 text-white border-green-500": verdict === "correct",
    "bg-yellow-500 text-white border-yellow-500": verdict === "present",
    "cell-animation": !!value,
  });
  return (
    <div
      className={`w-12 h-12 text-3xl border-solid border-2 rounded ml-1 font-extrabold uppercase flex items-center justify-center ${classes}`}
    >
      {value}
    </div>
  );
};

const EmptyRow = () => {
  const emptyCells = Array.from(Array(5));

  return (
    <div className="flex justify-center mb-1">
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  );
};

const CurrentRow = ({ guess }: { guess: string }) => {
  const emptyCells = Array.from(Array(5 - guess.length));

  return (
    <div className="flex justify-center mb-1">
      {guess.split("").map((letter, i) => (
        <Cell key={i} value={letter} />
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  );
};

const isEqual = (a: string, b: string) =>
  a.localeCompare(b, "pt-BR", { sensitivity: "base" }) === 0;

const getGuessVerdicts = (guess: string, solution: string): Verdict[] => {
  let verdicts = new Array<Verdict>(5).fill("absent");

  let incorrectLetters = "";
  for (let i = 0; i < 5; i++) {
    if (isEqual(guess[i], solution[i])) {
      verdicts[i] = "correct";
    } else {
      incorrectLetters += solution[i];
    }
  }

  for (let i = 0; i < 5; i++) {
    if (
      !isEqual(guess[i], solution[i]) &&
      incorrectLetters.includes(guess[i])
    ) {
      incorrectLetters = incorrectLetters.replace(guess[i], "");
      verdicts[i] = "present";
    }
  }

  return verdicts;
  /* TODO: Test cases to be implemented

  'Return' explanation:
  - 0 -> absent
  - 1 -> present
  - 2 -> correct

    | guess | solution | return | title (it should identify...)
  --| ----- | -------- | ------ | -----------------------------
  1 | ardua | patas    | 10001  | when the same word is present twice
  2 | matas | patas    | 02222  | 
  3 | tapas | patas    | 12122  | 
  4 | saara | patas    | 12100  | when the same word is both correct and present at the same time
  5 | patas | patas    | 22222  | when the puzzle is solved

  */
};

export const CompletedRow = ({
  guess,
  solution,
}: {
  guess: string;
  solution: string;
}) => {
  const verdicts = getGuessVerdicts(guess, solution);

  const guessWithDiacritics = normalizedToOriginal?.[guess] ?? guess;

  console.log(verdicts);

  return (
    <div className="flex justify-center mb-1">
      {guessWithDiacritics.split("").map((letter, i) => (
        <Cell key={i} value={letter} verdict={verdicts[i]} />
      ))}
    </div>
  );
};

const Board = ({
  guesses,
  currentGuess,
  solution,
}: {
  guesses: string[];
  currentGuess: string;
  solution: string;
}) => {
  const empties =
    guesses.length < 5 ? Array.from(Array(5 - guesses.length)) : [];

  return (
    <div className="pb-6">
      {guesses.map((guess, i) => (
        <CompletedRow key={i} guess={guess} solution={solution} />
      ))}
      {guesses.length < 6 && <CurrentRow guess={currentGuess} />}
      {empties.map((_, i) => (
        <EmptyRow key={i} />
      ))}
    </div>
  );
};

function Page() {
  const [solution] = useState("quiçá");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");

  // gameOver is needed because the game can end due to a disconnect on
  // multiplayer mode
  const [gameOver, setGameOver] = useState(false);

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

  return (
    <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
      {/* <header>
        <a href="/">Nome do Jogo Aqui</a>
        <span></span>
      </header> */}
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
        {JSON.stringify(data, null, 2)}
      </main>
    </div>
  );
}

export default Page;

// Ganhei de SuaMae69 acertando a palavra 'pedal' em 46 segundos
// Perdi de Garrucho errando a palavra 'pedal' em 46 segundos

// Ganhei de SuaMae69 em pvp.wesley.works! Acertei a palavra 'pedal' em 46 segundos
