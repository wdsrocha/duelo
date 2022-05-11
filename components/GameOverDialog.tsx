import * as Primitive from "@radix-ui/react-alert-dialog";
import { Button } from "../components/Button";
import toast from "react-hot-toast";
import { FaShare } from "react-icons/fa";

export const Content = ({ children, ...props }) => (
  <Primitive.Portal>
    <Primitive.Overlay className="fixed inset-0 bg-black opacity-30" />
    <Primitive.Content {...props}>{children}</Primitive.Content>
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
  const handleShare = async () => {
    await navigator.clipboard.writeText(getShareText());
    toast.success("Copiado para a área de transferência!");
  };

  return (
    <Primitive.Root open={open} onOpenChange={onOpenChange}>
      <Content className="fixed top-1/2 left-1/2 mx-auto w-full max-w-xs -translate-x-1/2 -translate-y-1/2 rounded bg-slate-200 px-4 pt-6 pb-4 focus:outline-none sm:max-w-lg">
        <Primitive.Title className="mb-4 text-4xl font-extrabold">
          {won ? "Vitória 🎉" : "Derrota 💀"}
        </Primitive.Title>
        <Primitive.Description className="mb-8 text-lg">
          A palavra era <b>{solution}</b>.
        </Primitive.Description>

        <div className="flex flex-col items-center justify-between sm:flex-row">
          <Button onClick={handleShare}>
            <div className="flex w-full items-center justify-center">
              Compartilhar
              <FaShare className="ml-2" />
            </div>
          </Button>
          <Primitive.AlertDialogAction asChild>
            <Button className="mt-2 sm:mt-0" onClick={onPlayAgain}>
              Jogar novamente
            </Button>
          </Primitive.AlertDialogAction>
        </div>
      </Content>
    </Primitive.Root>
  );
};
