import { ChangeEvent, useState } from "react";
import logo from "./assets/logo-nlw-expert.svg";
import { NewNote } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";

interface Note {
  id: string;
  date: Date;
  content: string;
}

//sempre que um componente muda, a função de estado roda novamente

export function App() {
  const [buscar, setBusca] = useState("");

  const [notes, setNotes] = useState<Note[]>(() => {
    const notasSalvas = localStorage.getItem("notes"); //busca no localstorage a key notes
    if (notasSalvas) {
      return JSON.parse(notasSalvas);
    }
    return [];
  });

  function aoCriarNota(content: string) {
    const newNote = {
      id: crypto.randomUUID(), //gera um id universal que nao repete nunca
      date: new Date(),
      content,
    };

    //... pega todas as notas ja criadas
    const notesArray = [newNote, ...notes];
    setNotes(notesArray);

    //transforma em JSON e salva no storage do navegador pois nao é possivel guardar array
    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function aoDeleterNota(id:string){
    const notesArray = notes.filter(note =>{
      return note.id != id
    })

    setNotes(notesArray)

    localStorage.setItem('notes',JSON.stringify(notesArray))
  }

  function deveBuscar(event: ChangeEvent<HTMLInputElement>) {
    const busca = event.target.value;
    setBusca(busca);
  }

  const notaFiltrada =
    buscar != ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(buscar.toLocaleLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="NLW Expert" />

      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder: text-slate-500"
          onChange={deveBuscar}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNote aoCriarNota={aoCriarNota} />

        {notaFiltrada.map((note) => {
          return <NoteCard key={note.id} note={note} aoDeleterNota={aoDeleterNota}/>;
        })}
      </div>
    </div>
  );
}
//key é próprio do react. É utilizado para trazer mais performece.
