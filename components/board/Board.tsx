import { CompletedRow, CurrentRow, EmptyRow } from "./Row";

export const Board = ({
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
