import { useState } from "react";

const NoteForm = ({ createNote }) => {
  const [newnote, setNewnote] = useState("");
  const addNote = (e) => {
    e.preventDefault();
    const note = {
      content: newnote,
      important: true,
    };
    createNote(note);
    setNewnote("");
  };
  return (
    <div>
      <form onSubmit={addNote}>
        <input
          value={newnote}
          onChange={({ target }) => setNewnote(target.value)}
        />
        <button type="submit">save</button>
      </form>
    </div>
  );
};
export default NoteForm;
