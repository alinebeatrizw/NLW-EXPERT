import { useState } from "react";
import logo from "./assets/Logo-nlw-expert.svg";
import { NewNote } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";


interface Note {
  id:string
  date:Date
  content: string 
}

export function App() {

  const [notes,setNotes] = useState<Note[]>([])


  function aoCriarNota(content: string){
    const newNote = {
      id: crypto.randomUUID(), //gera um id universal que nao repete nunca
      date: new Date(),
      content,
    }

    //... pega todas as notas ja criadas
    const notesArray = [newNote, ...notes]
    setNotes(notesArray)

    //transforma em JSON e salva no storage do navegador pois nao é possivel guardar array
    localStorage.setItem('notes', JSON.stringify(notesArray))

  }


  
  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6">
      <img src={logo} alt="NLW Expert" />

      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder: text-slate-500"/>
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-3 gap-6 auto-rows-[250px]">
        
        <NewNote aoCriarNota={aoCriarNota}/>

        {notes.map(note=>{
          return <NoteCard key={note.id} note={note} />
        })}

      </div>
    </div>
  )
}
//key é próprio do react. É utilizado para trazer mais performece. 