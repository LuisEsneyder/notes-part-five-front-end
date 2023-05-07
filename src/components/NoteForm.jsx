const NoteForm = ({ onSubmit, handleNoteChange, value }) => {
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={value} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};
export default NoteForm;
