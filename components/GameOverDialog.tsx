import * as Primitive from "@radix-ui/react-alert-dialog";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const Content = ({ children, ...props }) => (
  <Primitive.Portal>
    <Primitive.Overlay className="fixed inset-0 bg-black opacity-30" />
    {/* <Primitive.Overlay /> */}
    <Primitive.Content
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 focus:outline-none"
      // {...props}
    >
      {children}
    </Primitive.Content>
  </Primitive.Portal>
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
      <Content>
        <Primitive.Title>
          Você {won ? "Venceu! 🎉" : "Perdeu. 💀"}
        </Primitive.Title>
        <Primitive.Description>
          A palavra era <b>{solution}</b>.
        </Primitive.Description>

        <CopyToClipboard
          text={getShareText()}
          // onCopy={() => {}}
        >
          <button>Compartilhar</button>
        </CopyToClipboard>
        <Primitive.AlertDialogAction asChild>
          <button onClick={onPlayAgain}>Jogar novamente</button>
        </Primitive.AlertDialogAction>
      </Content>
    </Primitive.Root>
  );
};
