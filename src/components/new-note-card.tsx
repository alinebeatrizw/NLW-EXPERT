import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import {toast} from 'sonner'


interface NewNoteCardProps{
  aoCriarNota:(content:string)=>void
}

export function NewNote({aoCriarNota}:NewNoteCardProps) {
  const [deveMostrarTexto, setDeveMostrarTexto] = useState(true)
  const [content, setContent] = useState('')

  //quando usuario clicar no botão chama a função que altera o valor do useState
  function abrirEditor() {
    setDeveMostrarTexto(false);
  }

  //mostrar novamente as opções quando apagado todo texto digitado
  function mostrarOpcoes(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)
    
    if (event.target.value == "") {
      setDeveMostrarTexto(true);
    }
  }

  //salva a nota
  function salvaNota(event: FormEvent){
    event.preventDefault() //para nao ser redirecionado para outra pagina quando enviar o formulário
    
    aoCriarNota(content)

    setContent('')
    setDeveMostrarTexto(true)

    toast.success('Nota criada com sucesso!')
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
        <Dialog.Content className="overflow-hidden fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] h-[60vh] w-full bg-slate-700 rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>
          <form onSubmit={salvaNota} className="flex-1 flex-col flex">
          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-sm font-medium text-slate-300">
              Adicionar nota
            </span>

            {deveMostrarTexto ? (
              <p className="text-sm leading-6 text-slate-400">
                Começe{" "}
                <button className="font-medium text-lime-400 hover:underline">
                  {" "}
                  gravando uma nota
                </button>{" "}
                em áudio ou se preferir{" "}
                <button
                  className="font-medium text-lime-400 hover:underline"
                  onClick={abrirEditor}
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
          <button
            type="submit"
            className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-md hover:bg-lime-500"
          >
            Salvar nota
          </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
