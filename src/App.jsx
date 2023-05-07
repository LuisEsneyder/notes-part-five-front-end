import { useState, useEffect } from "react";
import Note from "./components/Note";
import Notificacion from "./components/Notificacion";
import noteService from "./services/note";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import NoteForm from "./components/NoteForm";

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
  const [showAll, setShowAll] = useState(true);
  const [errorMensaje, setErrorMensaje] = useState(null);
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
  const createNote = (note) => {
    noteService
      .create(note)
      .then((retunedNota) => {
        setNotes(notes.concat(retunedNota));
      })
      .catch((error) => {
        setErrorMensaje(error.response.data.error);
        setTimeout(() => {
          setErrorMensaje(null);
        }, 4000);
      });
  };
  const handleLogin = async (objecLogin) => {
    try {
      const user = await loginService.loging(objecLogin);
      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
    } catch (error) {
      setErrorMensaje("Wrong credentials");
      setTimeout(() => {
        setErrorMensaje(null);
      }, 5000);
    }
  };
  const loginForm = () => {
    return (
      <Togglable buttonLabel="log in">
        <LoginForm handleLogin={handleLogin} />
      </Togglable>
    );
  };
  const noteForm = () => {
    return (
      <Togglable buttonLabel="new note">
        <NoteForm createNote={createNote} />
      </Togglable>
    );
  };
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
