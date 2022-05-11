import { AccessibleIcon } from "@radix-ui/react-accessible-icon";
import * as Primitive from "@radix-ui/react-dialog";
import { FaInfo, FaTimes } from "react-icons/fa";
import { Verdict } from "../lib/utils";
import { Cell } from "./board/Cell";

export const Content = ({ children, ...props }) => (
  <Primitive.Portal>
    <Primitive.Overlay className="fixed inset-0 bg-black opacity-30" />
    <Primitive.Content {...props}>{children}</Primitive.Content>
  </Primitive.Portal>
);

const ExampleRow = ({
  guess,
  position,
  verdict,
}: {
  guess: string;
  position: number;
  verdict: Verdict;
}) => {
  return (
    <div className="my-2 flex w-64 justify-center">
      {guess.split("").map((letter, i) => (
        <Cell
          key={i}
          value={letter}
          verdict={i === position ? verdict : undefined}
        />
      ))}
    </div>
  );
};

const H2 = ({ children }) => (
  <h2 className="my-3 text-2xl font-bold">{children}</h2>
);

const H3 = ({ children }) => (
  <h3 className="my-2 text-lg font-bold">{children}</h3>
);

const P = ({ children }) => <p className="my-1">{children}</p>;

const A = ({ children, href }) => (
  <a href={href} className=" text-sky-600 hover:underline">
    {children}
  </a>
);

export const InfoDialog = () => (
  <Primitive.Root>
    <Primitive.Trigger asChild>
      <button className=" flex items-center justify-center rounded bg-slate-200 p-2 text-xl hover:bg-slate-300 active:bg-slate-400">
        <AccessibleIcon label="Informação">
          <FaInfo />
        </AccessibleIcon>
      </button>
    </Primitive.Trigger>
    <Content className="fixed top-1/2 left-1/2 mx-auto max-h-full w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded bg-slate-200 px-4 pb-4 pt-2 focus:outline-none">
      <H2>Como jogar</H2>
      <P>Adivinhe a palavra secreta em seis tentativas.</P>
      <P>Cada tentativa deve ser uma palavra válida de cinco letras.</P>
      <P>
        Após cada tentativa, as cores dos quadrados vão mudar para mostrar o
        quão perto sua tentativa foi da solução.
      </P>
      <H3>Exemplos</H3>
      <ExampleRow guess="penso" position={1} verdict="correct" />
      <P>
        A letra <b>E</b> está presente na solução e na posição correta.
      </P>
      <ExampleRow guess="forte" position={3} verdict="present" />
      <P>
        A letra <b>T</b> está presente na solução mas na posição incorreta.
      </P>
      <ExampleRow guess="quero" position={0} verdict="absent" />
      <P>
        A letra <b>Q</b> não está presente na solução.
      </P>
      <H2>Créditos</H2>
      <P>
        Jogo baseado em{" "}
        <A href="https://www.nytimes.com/games/wordle/index.html">Wordle</A>{" "}
        (inglês) e <A href="https://term.ooo/">Termo</A> (português).{" "}
      </P>
      <P>
        Feito por <A href="https://wdsrocha.com">@wdsrocha</A>.
      </P>
      <Primitive.Close asChild>
        <button className="absolute top-0 right-0 mt-4 mr-4 flex items-center justify-center rounded text-xl">
          <AccessibleIcon label="Voltar para o jogo">
            <FaTimes />
          </AccessibleIcon>
        </button>
      </Primitive.Close>
    </Content>
  </Primitive.Root>
);
