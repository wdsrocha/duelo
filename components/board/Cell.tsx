import classnames from "classnames";
import { Verdict } from "../../lib/utils";

export const Cell = ({
  value,
  verdict,
}: {
  value?: string;
  verdict?: Verdict;
}) => {
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
      className={`ml-1 flex aspect-square w-full items-center justify-center rounded border-2 border-solid text-4xl font-extrabold uppercase ${classes}`}
    >
      {value}
    </div>
  );
};
