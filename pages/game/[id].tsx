import Layout from "~/components/Layout";
import Message from "~/components/Message";
import MessageInput from "~/components/MessageInput";
import KeyboardWrapper from "../../components/KeyboardWrapper";
import { useRouter } from "next/router";
import { useStore, addMessage } from "~/lib/Store";
import {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import UserContext from "~/lib/UserContext";
import Link from "next/link";
import Keyboard from "react-simple-keyboard/build/components/Keyboard";

const WORD_SIZE = 5;
const NUMBER_OF_ATTEMPTS = 6;

const Page = (props) => {
  // const router = useRouter();
  // const { user, authLoaded, signOut } = useContext(UserContext);

  const keyboardRef = useRef<typeof Keyboard>(null);

  const [gameOver, setGameOver] = useState(false);
  const [inputs, setInputs] = useState([""]);

  const onKeyPress = (key: string) => {
    if (gameOver) {
      return;
    }

    const currentRow = inputs.length - 1;

    if (key === "{backspace}") {
      const newInput = inputs[currentRow].slice(0, -1);
      setInputs([...inputs.slice(0, -1), newInput]);
    } else if (key === "{ent}") {
      if (inputs[currentRow].length !== WORD_SIZE) {
        console.log(`Só palavras com ${WORD_SIZE} letras`);
      } else {
        const wordExists = true;
        if (wordExists) {
          if (currentRow + 1 === NUMBER_OF_ATTEMPTS) {
            setGameOver(true);
          } else {
            setInputs([...inputs, ""]);
          }
        } else {
          console.log("Palavra inválida");
        }
      }
    } else {
      const newInput = (inputs[currentRow] + key).slice(0, WORD_SIZE);
      setInputs([...inputs.slice(0, -1), newInput]);
    }
  };

  const opponentClassName = "leading-3";

  return (
    <div className="mx-auto max-w-3xl flex flex-col h-screen pt-3 px-4">
      <header className="flex">
        <span className="flex-1">Worlde Arena</span>
        <span>Perfil</span>
        <span>Configuração</span>
      </header>
      <div>
        <div className="flex justify-center">wdsrocha VS anon1</div>
        <div className="flex">
          <span>Your Oponent:</span>
          <div style={{ fontSize: "10px" }}>
            <div className={opponentClassName}>⬛🟨🟩🟨⬛</div>
            <div className={opponentClassName}>🟩🟩🟩⬛🟩</div>
            <div className={opponentClassName}>🟩🟩🟩⬛🟩</div>
            <div className={opponentClassName}>🟩🟩🟩⬛🟩</div>
            <div className={opponentClassName}>⬛⬛⬛⬛⬛</div>
          </div>
        </div>
        <div className="bg-gray-400 space-y-3">
          {[...new Array(NUMBER_OF_ATTEMPTS)].map((_, i) => (
            <div key={i} className="flex flex-row justify-around">
              {[
                [...new Array(WORD_SIZE)].map((_, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="bg-gray-600 w-10 flex justify-center"
                  >
                    {inputs[i] ? inputs[i][j] ?? "\u00A0" : "\u00A0"}
                  </div>
                )),
              ]}
            </div>
          ))}
        </div>
        <div>
          <KeyboardWrapper
            onKeyPress={onKeyPress}
            keyboardRef={(r) => (keyboardRef.current = r)}
            newLineOnEnter
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
