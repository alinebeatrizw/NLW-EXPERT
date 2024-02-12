import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProps {
  aoCriarNota: (content: string) => void;
}

let gravacao: SpeechRecognition | null = null;

export function NewNote({ aoCriarNota }: NewNoteCardProps) {
  const [deveMostrarTexto, setDeveMostrarTexto] = useState(true);
  const [content, setContent] = useState("");
  const [estaGravando, setEstaGravando] = useState(false);

  //quando usuario clicar no botão chama a função que altera o valor do useState
  function abrirEditor() {
    setDeveMostrarTexto(false);
  }

  //mostrar novamente as opções quando apagado todo texto digitado
  function mostrarOpcoes(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);

    if (event.target.value == "") {
      setDeveMostrarTexto(true);
    }
  }

  //salva a nota
  function salvaNota(event: FormEvent) {
    event.preventDefault(); //para nao ser redirecionado para outra pagina quando enviar o formulário

    if (content == "") {
      return;
    }

    aoCriarNota(content);

    setContent("");
    setDeveMostrarTexto(true);

    toast.success("Nota criada com sucesso!");
  }

  function iniciarGravacao() {
    const aPIEstaDisponivel =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!aPIEstaDisponivel) {
      alert("Infelizmente seu navegador não suporta a API de gravação");
      return;
    }
    setEstaGravando(true);
    setDeveMostrarTexto(false);

    const apiGravacao =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    gravacao = new apiGravacao();

    gravacao.lang = "pt-BR";
    gravacao.continuous = true;
    gravacao.maxAlternatives = 1;
    gravacao.interimResults = true; //traz os resultados conforme for falando e não somente no final

    gravacao.onresult = (event) => {
      const transcricao = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");

      setContent(transcricao);
    };

    gravacao.onerror = (event) => {
      console.log(event.error);
    };

    gravacao.start();
  }

  function pararGravacao() {
    setEstaGravando(false);

    if (gravacao !== null) {
      gravacao.stop();
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="flex flex-col rounded-md bg-slate-700 p-5 gap-3 overflow-hidden text-left hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="overflow-hidden fixed inset-0  md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] w-full bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>
          <form className="flex-1 flex-col flex">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>

              {deveMostrarTexto ? (
                <p className="text-sm leading-6 text-slate-400">
                  Começe{" "}
                  <button
                    className="font-medium text-lime-400 hover:underline"
                    onClick={iniciarGravacao}
                    type="button"
                  >
                    {" "}
                    gravando uma nota
                  </button>{" "}
                  em áudio ou se preferir{" "}
                  <button
                    className="font-medium text-lime-400 hover:underline"
                    onClick={abrirEditor}
                    type="button"
                  >
                    utilize apenas texto .
                  </button>
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={mostrarOpcoes}
                  value={content}
                />
              )}
            </div>

            {estaGravando ? (
              <button
                type="button"
                onClick={pararGravacao}
                className="flex items-center justify-center gap-2 w-full bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-md hover:text-slate-100"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando! (Clique para interromper)
              </button>
            ) : (
              <button
                type="button"
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-md hover:bg-lime-500"
                onClick={salvaNota}
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
