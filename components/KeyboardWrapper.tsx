import React, { ComponentProps, FC } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const KeyboardWrapper: FC<ComponentProps<typeof Keyboard>> = ({ ...props }) => {
  return (
    <Keyboard
      physicalKeyboardHighlight
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
      {...props}
    />
  );
};

export default KeyboardWrapper;
