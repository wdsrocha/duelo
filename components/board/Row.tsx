import { normalizedToOriginal } from "../../lib/Dictionary";
import { getGuessVerdicts } from "../../lib/utils";
import { Cell } from "./Cell";

export const EmptyRow = () => {
  const emptyCells = Array.from(Array(5));
  return (
    <div className="mb-1 flex justify-center">
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  );
};

export const CurrentRow = ({ guess }: { guess: string }) => {
  const emptyCells = Array.from(Array(5 - guess.length));
  return (
    <div className="mb-1 flex justify-center">
      {guess.split("").map((letter, i) => (
        <Cell key={i} value={letter} />
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  );
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

  return (
    <div className="mb-1 flex justify-center">
      {guessWithDiacritics.split("").map((letter, i) => (
        <Cell key={i} value={letter} verdict={verdicts[i]} />
      ))}
    </div>
  );
};
