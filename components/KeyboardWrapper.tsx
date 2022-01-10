import React, { ComponentProps, FC } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const KeyboardWrapper: FC<ComponentProps<typeof Keyboard>> = ({ ...props }) => {
  return (
    <Keyboard
      {...props}
      layoutName="default"
      layout={{
        default: [
          "q w e r t y u i o p",
          "a s d f g h j k l {backspace}",
          "z x c v b n m {ent}",
        ],
      }}
      display={{
        "{backspace}": "⌫",
        "{ent}": "↵",
      }}
    />
  );
};

export default KeyboardWrapper;
