import {
  possibleAnswers,
  normalizedToOriginal,
  validWords,
} from "./Dictionary";

export type Verdict = "absent" | "present" | "correct";

export const isEqual = (a: string, b: string) =>
  a.localeCompare(b, "pt-BR", { sensitivity: "base" }) === 0;

export const getGuessVerdicts = (
  guess: string,
  solution: string
): Verdict[] => {
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
      incorrectLetters
        .split("")
        .some((solutionLetter) => isEqual(guess[i], solutionLetter))
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
  6 | penas | harém    | 01010  | when there is a present guess with different accent

  */
};

for (const possibleAnswer of possibleAnswers) {
  validWords.add(possibleAnswer);
}

export const isValidWord = (word: string) =>
  validWords.has(word) || !!normalizedToOriginal[word];

export const getRandomSolution = () =>
  possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
