import classNames from "classnames";
import { ReactNode } from "react";

type Size = "middle" | "large";

interface Props {
  children?: ReactNode;
  size?: Size;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const Button = ({
  children,
  size = "middle",
  className,
  disabled,
  onClick,
}: Props) => {
  let sizeTokens = "h-14 w-56 text-lg"; // middle by default
  if (size === "large") {
    sizeTokens = "h-16 w-64 text-2xl";
  }

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={classNames(
        className,
        sizeTokens,
        "flex items-center justify-center rounded-md border bg-green-600 px-4 py-2 font-bold uppercase text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2  disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
      )}
    >
      {children}
    </button>
  );
};
