import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useState } from "react";

// export const Modal = () => (
//   <DialogPrimitive.Root defaultOpen={true}>
//     <DialogPrimitive.Trigger />
//     <DialogPrimitive.Portal>
//       <DialogPrimitive.Overlay />
//       <DialogPrimitive.Content className="bg-white">
//         <DialogPrimitive.Title>Bom dia</DialogPrimitive.Title>
//         <DialogPrimitive.Description />
//         <DialogPrimitive.Close />
//       </DialogPrimitive.Content>
//     </DialogPrimitive.Portal>
//   </DialogPrimitive.Root>
// );

export const Content = ({ children, ...props }) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className=" fixed inset-0 bg-black opacity-30" />
    <DialogPrimitive.Content
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 focus:outline-none"
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);

export const Dialog = ({
  open,
  onOpenChange,
  solution,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => {};
  solution: string;
}) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger className={open ? "bg-blue-300" : "bg-blue-500"}>
        Open
      </DialogPrimitive.Trigger>
      <Content>
        <DialogPrimitive.Title>Você venceu!</DialogPrimitive.Title>
        <DialogPrimitive.Description>
          A palavra era <b>{solution}</b>.
        </DialogPrimitive.Description>
        <button>Compartilhar</button>
        <DialogPrimitive.Close asChild>
          <button>Jogar novamente</button>
        </DialogPrimitive.Close>
      </Content>
    </DialogPrimitive.Root>
  );
};
