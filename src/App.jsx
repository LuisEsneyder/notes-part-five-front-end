import { useState, useEffect } from "react";
import Note from "./components/Note";
import Notificacion from "./components/Notificacion"
import noteService from "./services/note"

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return(
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2022</em>
    </div>
  )
}
const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMensaje, setErrorMensaje] = useState(null)

  useEffect(() => {
    noteService
      .getAll().then(inicialNotes=>{
        setNotes(inicialNotes)
      })
  }, []);
  const notesToShow = showAll ? notes : notes.filter((note) => note.important);
  const toggleImportanceOf = (id) => {
    const note = notes.find(element => element._id ===id)
    const changedNote = {...note, important : !note.important}
    
    noteService.update(id, changedNote).then(response => {
      setNotes(notes.map(element => element._id === response._id ? response : element))
    }).catch((error) => {
      setErrorMensaje(
        `Note '${note.content}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMensaje(null)
      },4000)
      setNotes(notes.filter(element => element._id !== id))
    })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };
  const handleShowNote = () => {
    setShowAll(!showAll);
  };

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };
    noteService.create(noteObject).then((retunedNota) => {
      setNotes(notes.concat(retunedNota))
      setNewNote('')
    }).catch(error => {
      setErrorMensaje(error.response.data.error)
      setTimeout(() => {
        setErrorMensaje(null)
      },4000)
    })
    setNewNote('')
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notificacion mensaje={errorMensaje}/>
      <div>
        <button onClick={handleShowNote}>
          {showAll ? "important" : "showAll"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note._id} note={note} toggleImportance = {() => toggleImportanceOf(note._id)} />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer/>
    </div>
  );
};

export default App;
