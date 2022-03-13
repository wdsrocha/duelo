import React, { ComponentProps, FC } from "react";
import Keyboard from "react-simple-keyboard";
import { Verdict } from "../lib/utils";

interface Props extends ComponentProps<typeof Keyboard> {
  verdictByUsedLetter: Record<string, Verdict>;
}

const KeyboardWrapper: FC<Props> = ({ verdictByUsedLetter, ...props }) => {
  const letters: Record<Verdict, string[]> = {
    absent: [],
    present: [],
    correct: [],
  };

  Object.entries(verdictByUsedLetter ?? {}).forEach(([letter, verdict]) => {
    letters[verdict].push(letter);
  });

  return (
    <Keyboard
      physicalKeyboardHighlightPress
      layoutName="default"
      layout={{
        default: [
          "q w e r t y u i o p",
          "a s d f g h j k l {backspace}",
          "z x c v b n m {enter}",
        ],
      }}
      display={{
        "{backspace}": "⌫",
        "{enter}": "↵",
      }}
      buttonTheme={[
        {
          class: "text-white border-slate-400 bg-slate-400",
          buttons: letters.absent.join(" "),
        },
        {
          class: "text-white border-yellow-500 bg-yellow-500",
          buttons: letters.present.join(" "),
        },
        {
          class:
            "text-white border-green-500 bg-green-500 hover:bg-green-600 active:bg-green-700 focus:bg-green-700",
          buttons: letters.correct.join(" "),
        },
        {
          class: "border-slate-200 border-2 cell-animation",
          buttons:
            "q w e r t y u i o p a s d f g h j k l z x c v b n m {backspace} {enter}",
        },
      ]}
      {...props}
    />
  );
};

export default KeyboardWrapper;
