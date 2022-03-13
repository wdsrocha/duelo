import { Key, KeyValue } from "./Key";
import { useEffect } from "react";
import { Verdict } from "../../lib/utils";

const getVerdictByLetter = (guesses: string[], solution: string) => {
  const obj: Record<Verdict, string> = { absent: "", correct: "", present: "" };

  guesses.forEach((guess) => {
    guess.split("").forEach((letter, i) => {
      if (!solution.includes(letter)) {
        obj[letter] = "absent";
      } else if (letter === solution[i]) {
        obj[letter] = "correct";
      } else if (obj[letter] !== "correct") {
        obj[letter] = "present";
      }
    });
  });

  return obj;
};

type Props = {
  onKeyPress: (value: string) => void;
  guesses: string[];
  solution: string;
  className?: string;
};

export const Keyboard = ({
  onKeyPress,
  guesses,
  solution,
  className,
}: Props) => {
  const verdictByLetter = getVerdictByLetter(guesses, solution);

  const onClick = (value: KeyValue) => {
    onKeyPress(value);
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        onKeyPress("{enter}");
      } else if (e.code === "Backspace") {
        onKeyPress("{backspace}");
      } else if ("a" <= e.key && e.key <= "z") {
        onKeyPress(e.key);
      }
    };
    window.addEventListener("keyup", listener);
    return () => {
      window.removeEventListener("keyup", listener);
    };
  }, [onKeyPress]);

  return (
    <div>
      <div className="justify-left mb-1 flex">
        <Key value="q" onClick={onClick} verdict={verdictByLetter["q"]} />
        <Key value="w" onClick={onClick} verdict={verdictByLetter["w"]} />
        <Key value="e" onClick={onClick} verdict={verdictByLetter["e"]} />
        <Key value="r" onClick={onClick} verdict={verdictByLetter["r"]} />
        <Key value="t" onClick={onClick} verdict={verdictByLetter["t"]} />
        <Key value="y" onClick={onClick} verdict={verdictByLetter["y"]} />
        <Key value="u" onClick={onClick} verdict={verdictByLetter["u"]} />
        <Key value="i" onClick={onClick} verdict={verdictByLetter["i"]} />
        <Key value="o" onClick={onClick} verdict={verdictByLetter["o"]} />
        <Key value="p" onClick={onClick} verdict={verdictByLetter["p"]} />
      </div>
      <div className="justify-left mb-1 flex">
        <div className="justify-left flex pl-4">
          <Key value="a" onClick={onClick} verdict={verdictByLetter["a"]} />
          <Key value="s" onClick={onClick} verdict={verdictByLetter["s"]} />
          <Key value="d" onClick={onClick} verdict={verdictByLetter["d"]} />
          <Key value="f" onClick={onClick} verdict={verdictByLetter["f"]} />
          <Key value="g" onClick={onClick} verdict={verdictByLetter["g"]} />
          <Key value="h" onClick={onClick} verdict={verdictByLetter["h"]} />
          <Key value="j" onClick={onClick} verdict={verdictByLetter["j"]} />
          <Key value="k" onClick={onClick} verdict={verdictByLetter["k"]} />
          <Key value="l" onClick={onClick} verdict={verdictByLetter["l"]} />
          <Key value="{backspace}" onClick={onClick}>
            ⌫
          </Key>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="justify-left flex pl-8">
          <Key value="z" onClick={onClick} verdict={verdictByLetter["z"]} />
          <Key value="x" onClick={onClick} verdict={verdictByLetter["x"]} />
          <Key value="c" onClick={onClick} verdict={verdictByLetter["c"]} />
          <Key value="v" onClick={onClick} verdict={verdictByLetter["v"]} />
          <Key value="b" onClick={onClick} verdict={verdictByLetter["b"]} />
          <Key value="n" onClick={onClick} verdict={verdictByLetter["n"]} />
          <Key value="m" onClick={onClick} verdict={verdictByLetter["m"]} />
        </div>
        <Key value="{enter}" onClick={onClick}>
          ENTER
        </Key>
      </div>
    </div>
  );
};
