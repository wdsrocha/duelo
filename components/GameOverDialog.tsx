import * as Primitive from "@radix-ui/react-alert-dialog";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const Content = ({ children, ...props }) => (
  <Primitive.Portal>
    <Primitive.Overlay className="fixed inset-0 bg-black opacity-30" />
    <Primitive.Content {...props}>{children}</Primitive.Content>
  </Primitive.Portal>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className="flex h-14 w-56 items-center justify-center rounded-md border bg-green-600 px-4 py-2 text-lg font-bold uppercase text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
  >
    {children}
  </button>
);

export const GameOverDialog = ({
  open,
  onOpenChange,
  won,
  solution,
  onPlayAgain,
  getShareText,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlayAgain: () => void;
  won: boolean;
  getShareText: () => string;
  solution: string;
}) => {
  return (
    <Primitive.Root open={open} onOpenChange={onOpenChange}>
      <Content className="fixed top-1/2 left-1/2 mx-auto w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded bg-slate-200 px-4 pt-6 pb-4 focus:outline-none">
        <Primitive.Title className="mb-4 text-4xl font-extrabold">
          {won ? "Vitória 🎉" : "Derrota 💀"}
        </Primitive.Title>
        <Primitive.Description className="mb-8 text-lg">
          A palavra era <b>{solution}</b>.
        </Primitive.Description>

        <div className="flex justify-between">
          <CopyToClipboard text={getShareText()}>
            <Button>Compartilhar</Button>
          </CopyToClipboard>
          <Primitive.AlertDialogAction asChild>
            <Button className="ml-2" onClick={onPlayAgain}>
              Jogar novamente
            </Button>
          </Primitive.AlertDialogAction>
        </div>
      </Content>
    </Primitive.Root>
  );
};
