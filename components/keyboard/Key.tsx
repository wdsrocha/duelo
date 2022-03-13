import { ReactNode } from "react";
import classnames from "classnames";
import { Verdict } from "../../lib/utils";

export type KeyValue =
  | "q"
  | "w"
  | "e"
  | "r"
  | "t"
  | "y"
  | "u"
  | "i"
  | "o"
  | "p"
  | "a"
  | "s"
  | "d"
  | "f"
  | "g"
  | "h"
  | "j"
  | "k"
  | "l"
  | "z"
  | "x"
  | "c"
  | "v"
  | "b"
  | "n"
  | "m"
  | "{backspace}"
  | "{enter}";

type Props = {
  children?: ReactNode;
  value: KeyValue;
  verdict?: Verdict;
  onClick: (value: KeyValue) => void;
  className?: string;
};

export const Key = ({
  children,
  verdict,
  value,
  onClick,
  className,
}: Props) => {
  const classes = classnames({
    "w-full": value === "{enter}",
    "w-7 sm:w-10": value !== "{enter}",
    "bg-slate-200 hover:bg-slate-300 active:bg-slate-400": !verdict,
    "bg-slate-400 text-white": verdict === "absent",
    "bg-green-500 hover:bg-green-600 active:bg-green-700 text-white":
      verdict === "correct",
    "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white":
      verdict === "present",
  });

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick(value);
    event.currentTarget.blur();
  };

  return (
    <button
      className={`mx-0.5 flex h-14 cursor-pointer select-none items-center justify-center rounded text-xs font-bold uppercase sm:text-lg ${classes} ${className} `}
      onClick={handleClick}
    >
      {children || value}
    </button>
  );
};
