import { useEffect, useState } from "react";
import ModalEditWord from "./modals/ModalEditWord";
import ModalAddWord from "./modals/ModalAddWord";
import { saveAs } from "file-saver";
import axios from "axios";
import "./App.css";

function App() {
  const [word, setWord] = useState("");
  const [wordList, setWordList] = useState([]);
  const [isThereChangeWord, setIsThereChangeWord] = useState(false);
  const [meaning, setMeaning] = useState("");
  const [filterText, setFilterText] = useState("");
  const [isChecked, setIsChecked] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("none");
  const [editWord, setEditWord] = useState("");
  const [editMeaning, setEditMeaning] = useState("");
  const [editId, setEditId] = useState("");
  const [isAlphabetical, setIsAlphabetical] = useState(false);
  const [oneDataWord, setOneDataWord] = useState({})

  const handleAddWord = () => {
    if (!word || !meaning) {
      alert("Please, type a word and its meaning");
      return;
    }

    axios
      .post("http://localhost:3000/create-word", {
        word: word,
        meaning: meaning,
      })
      .then(() => {
        setIsThereChangeWord(true);
      })
      .catch((error) => {
        console.error(error);
      });

    setWord("");
    setMeaning("");
  };

  const handleMarkLearned = async (wordId) => {
    try {
      setIsChecked((prev) => [...prev, wordId]);
      await axios.put(`http://localhost:3000/update-times-learned/${wordId}`);
      setIsThereChangeWord(true);
    } catch (error) {
      console.error(error);
    }
  };

  const downloadList = () => {
    const wordData = wordList
      .map((word) => `${word.word}: ${word.meaning}\n`)
      .join("");
    const blob = new Blob([wordData], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "word_list.txt");
  };

  const handleShuffleWords = () => {
    const shuffledList = [...wordList].sort(() => Math.random() - 0.5);
    setWordList(shuffledList);
  };

  const handleUpdateWord = async () => {
    if (!editWord || !editMeaning) {
      alert("Please, fill in both fields.");
      return;
    }

    try {
      await axios.put(`http://localhost:3000/update-word/${editId}`, {
        word: editWord,
        meaning: editMeaning,
      });
      setIsThereChangeWord(true); // Refresca la lista de palabras
      document.getElementById("edit_modal").close(); // Cierra el modal
    } catch (error) {
      console.error(error);
      alert("Error updating the word.");
    }
  };

  const handleGetOneDataWord = (wordData) => {
    setOneDataWord(wordData)
    document.getElementById("detail_modal").showModal(); // Abre el modal
  }

  const openEditModal = (word) => {
    setEditWord(word.word); // Establece el valor de la palabra en el input
    setEditMeaning(word.meaning); // Establece el significado en el input
    setEditId(word.id); // Guarda el ID de la palabra para la actualización
    document.getElementById("edit_modal").showModal(); // Abre el modal
  };

  const handleAlphabeticalChange = (e) => {
    setIsAlphabetical(e.target.checked);
  };

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await axios.get("http://localhost:3000/words");
        setWordList(response.data);
        setIsThereChangeWord(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWords();
  }, [isThereChangeWord]);

  useEffect(() => {
    if (!isAlphabetical) {
      handleShuffleWords();
    }
  }, [isAlphabetical]);

  return (
    <div className="bg-[#f0f0f0] p-8 relative">
      <span className="text-black text-xs absolute top-2.5 left-2.5">
        Palabras: {wordList.length}
      </span>
      <h1 className="text-center mb-5 text-[#252525] text-5xl mt-1 font-semibold">
        Practice English Words
      </h1>
      <div className="flex justify-center mb-3">
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="input w-full rounded-md me-2"
          placeholder="Filter words"
        />
        <select
          value={selectedLetter}
          onChange={(e) => setSelectedLetter(e.target.value)}
          className="select rounded-md w-full"
        >
          <option disabled={true}>Filter by letter</option>
          <option value="none">none</option>
          {Array.from({ length: 26 }, (_, i) => (
            <option key={i} value={String.fromCharCode(65 + i)}>
              {String.fromCharCode(65 + i)}
            </option>
          ))}
        </select>
      </div>
      <label className="fieldset-label text-black mb-3">
        <input
          type="checkbox"
          className="checkbox checkbox-neutral checkbox-sm"
          onClick={handleAlphabeticalChange}
        />
        <small>Habilitar orden alfabético</small>
      </label>
      <div className="rounded-sm h-96 overflow-y-scroll text-black mx-auto max-w-[500px] border border-gray-300">
        <ul>
          {wordList
            .sort((a, b) =>
              isAlphabetical ? a?.word?.localeCompare(b.word) : 0
            ) // Ordena solo si el checkbox está activo
            .filter((word) =>
              filterText !== ""
                ? word?.word?.toLowerCase().includes(filterText.toLowerCase())
                : true
            )
            .filter((word) =>
              selectedLetter === "none"
                ? true
                : word?.word && word.word[0]?.toUpperCase() === selectedLetter
            )
            .map((word, index) => (
              <li key={index} className="p-3 border-b border-gray-300">
                <p className="font-semibold">{word.word}:</p>{" "}
                <p className="mb-2">{word.meaning}</p>
                <div className="flex justify-end gap-2">
                  <button
                    className="btn btn-xs"
                    onClick={() => openEditModal(word)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-xs bg-blue-950"
                    onClick={() => handleGetOneDataWord(word)}
                  >
                    Details
                  </button>
                  <button
                    className={`btn btn-xs ${
                      isChecked.includes(word.id)
                        ? " bg-green-700"
                        : " bg-gray-700"
                    }`}
                    onClick={() => handleMarkLearned(word.id)}
                  >
                    Learned({word.timeslearned})
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
      <div className="flex justify-center gap-2.5 mt-5">
        <button
          className="btn w-28"
          disabled={isAlphabetical}
          onClick={handleShuffleWords}
        >
          Shuffle
        </button>
        <button className="btn w-28" onClick={downloadList}>
          Download
        </button>
        <button
          className="btn w-28"
          onClick={() => document.getElementById("add_word_modal").showModal()}
        >
          Add Word
        </button>
      </div>
      <dialog id="detail_modal" className="modal">
      <div className="modal-box">
        <div className="flex flex-col mt-4">
        <h1 className="text-2xl mb-1">{oneDataWord?.word}</h1>
        <p className="mb-1">Meaning: {oneDataWord?.meaning}</p>
        <p>Description: {oneDataWord?.description} </p>
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
      {/* Modal to Add Word */}
      <ModalAddWord
        word={word}
        setWord={setWord}
        meaning={meaning}
        setMeaning={setMeaning}
        handleAddWord={handleAddWord}
      />
      {/* Modal to Edit Word */}
      <ModalEditWord
        editWord={editWord}
        setEditWord={setEditWord}
        editMeaning={editMeaning}
        setEditMeaning={setEditMeaning}
        handleUpdateWord={handleUpdateWord}
      />
    </div>
  );
}

export default App;
