import { useState, useEffect } from "react";
import Note from "./components/Note";
import Notificacion from "./components/Notificacion";
import noteService from "./services/note";
import loginService from "./services/login";

const Footer = () => {
  const footerStyle = {
    color: "green",
    fontStyle: "italic",
    fontSize: 16,
  };
  return (
    <div style={footerStyle}>
      <br />
      <em>
        Note app, Department of Computer Science, University of Helsinki 2022
      </em>
    </div>
  );
};
const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMensaje, setErrorMensaje] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    noteService.getAll().then((inicialNotes) => {
      setNotes(inicialNotes);
    });
  }, []);
  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);
  const notesToShow = showAll ? notes : notes.filter((note) => note.important);
  const toggleImportanceOf = (id) => {
    const note = notes.find((element) => element._id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((response) => {
        setNotes(
          notes.map((element) =>
            element._id === response._id ? response : element
          )
        );
      })
      .catch((error) => {
        setErrorMensaje(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMensaje(null);
        }, 4000);
        setNotes(notes.filter((element) => element._id !== id));
      });
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
    noteService
      .create(noteObject)
      .then((retunedNota) => {
        setNotes(notes.concat(retunedNota));
        setNewNote("");
      })
      .catch((error) => {
        setErrorMensaje(error.response.data.error);
        setTimeout(() => {
          setErrorMensaje(null);
        }, 4000);
      });
    setNewNote("");
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.loging({ username, password });
      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      setErrorMensaje("Wrong credentials");
      setUsername("");
      setPassword("");
      setTimeout(() => {
        setErrorMensaje(null);
      }, 5000);
    }
  };
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <div>
        <button type="submit">login</button>
      </div>
    </form>
  );
  const noteForm = () => (
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={({ target }) => setNewNote(target.value)}
      />
      <button type="submit">save</button>
    </form>
  );
  return (
    <div>
      <h1>Notes</h1>
      <Notificacion mensaje={errorMensaje} />
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in </p>
          {noteForm()}
        </div>
      )}
      <div>
        <button onClick={handleShowNote}>
          {showAll ? "important" : "showAll"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note._id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note._id)}
          />
        ))}
      </ul>

      <Footer />
    </div>
  );
};

export default App;
