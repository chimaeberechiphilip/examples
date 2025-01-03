import { useState, useEffect } from "react";
import Note from "./component/Note";
import Notification from "./component/Notification";
import noteService from "./services/notes";
import Footer from "./component/Footer";

/*setTimeout(() => {
  console.log("loop..");
  let i = 0;
  while (i < 50000000000) {
    i++;
  }
  console.log("end");
}, 5000); */

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNotes, setNewNotes] = useState();
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  /*const hook = () => {
    console.log("effect");
    axios.get("http://localhost:3002/notes").then((response) => {
      console.log("promise fulfilled");
      setNotes(response.data);
    });
  };
  useEffect(hook, []);*/

  const addNote = (event) => {
    event.preventDefault();
    console.log("button clicked", event.target);

    const noteObject = {
      content: newNotes,
      important: Math.random() < 0.5,
      id: String(notes.length + 1),
    };

    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNotes("");
    });
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNotes(event.target.value);
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  /* This is normal way of updating a file
  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3002/notes/${id}`;
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    axios.put(url, changedNote).then((response) => {
      setNotes(notes.map((n) => (n.id === id ? response.data : n)));
    });
  };*/

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id === id ? returnedNote : note)));
      })
      .catch((error) => {
        //alert(`the note '${note.content}' was already deleted from server`);
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  return (
    <div>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>

      <h1>Where Notes is True</h1>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <ul>
        {notes.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNotes} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>

      <Footer />
    </div>
  );
};

export default App;
