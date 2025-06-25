import React, { useCallback, useEffect, useMemo, useState } from "react";
import ModalEditWord from "./modals/ModalEditWord";
import ModalAddWord from "./modals/ModalAddWord";
import { saveAs } from "file-saver";
import "./App.css";
import WordItem from "./components/WordItem";
import {
  createWord,
  getAnswersMeaning,
  getRandomWord,
  getWords,
  updateHideWord,
  updateTimesLearned,
  updateWord,
} from "./api/services";
import ModalDetail from "./modals/ModalDetail";

function App() {
  const [word, setWord] = useState("");
  const [wordList, setWordList] = useState([]);
  const [isThereChangeWord, setIsThereChangeWord] = useState(false);
  const [meaning, setMeaning] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("");
  const [filterText, setFilterText] = useState("");
  const [isChecked, setIsChecked] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("All");
  const [editWord, setEditWord] = useState("");
  const [editMeaning, setEditMeaning] = useState("");
  const [editDescription, setEditDescription] = useState("");
   const [editLevel, setEditLevel] = useState("");
  const [editId, setEditId] = useState("");
  const [isAlphabetical, setIsAlphabetical] = useState(false);
  const [oneDataWord, setOneDataWord] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  /* hooks from game */
  const [randomWord, setRandomWord] = useState({});
  const [getAnswers, setGetAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [countCorrectAnswers, setCountCorrectAnswers] = useState(0);
  const itemsPerPage = 10;

  const handleAddWord = async () => {
    if (!word || !meaning || !description || !level) {
      alert("A field is missing");
      return;
    }
    try {
      await createWord(word, meaning, description, level);
      setIsThereChangeWord(true);
      setDescription("");
      setLevel("")
      setWord("");
      setMeaning("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkLearned = async (wordId) => {
    try {
      await updateTimesLearned(wordId);
      setIsChecked((prev) => [...prev, wordId]);
      setIsThereChangeWord(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleHideWord = async (wordId, isHidden) => {
    try {
      await updateHideWord(wordId, isHidden);
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

  const handleShuffleWords = useCallback(() => {
    setWordList((prevList) => [...prevList].sort(() => Math.random() - 0.5));
  }, []);

  const handleUpdateWord = async () => {
    if (!editWord || !editMeaning || !editDescription || !editLevel) {
      alert("A field is missing");
      return;
    }

    try {
      await updateWord(editWord, editMeaning, editDescription, editLevel, editId);
      setIsThereChangeWord(true); // Refresca la lista de palabras
      setEditDescription("");
      setEditLevel("")
      document.getElementById("edit_modal").close(); // Cierra el modal
    } catch (error) {
      console.error(error);
      alert("Error updating the word.");
    }
  };

  const handleGetOneDataWord = (wordData) => {
    setOneDataWord(wordData);
    document.getElementById("detail_modal").showModal(); // Abre el modal
  };

  const openEditModal = (word) => {
    setEditLevel(word.cefr_level)
    setEditDescription(word.description);
    setEditWord(word.word); // Establece el valor de la palabra en el input
    setEditMeaning(word.meaning); // Establece el significado en el input
    setEditId(word.id); // Guarda el ID de la palabra para la actualización
    document.getElementById("edit_modal").showModal(); // Abre el modal
  };

  const handleAlphabeticalChange = (e) => {
    setIsAlphabetical(e.target.checked);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchRandomWord = async () => {
    try {
      setSelectedAnswer({});
      const responseRandomWord = await getRandomWord();
      setRandomWord(responseRandomWord.data);
      if (responseRandomWord.data) {
        const responseAnswersMeanings = await getAnswersMeaning(
          responseRandomWord.data.id
        );
        setGetAnswers(responseAnswersMeanings.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRandomWord();
  }, []);
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await getWords();
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

  const sortedWordList = useMemo(() => {
    return isAlphabetical
      ? [...wordList].sort((a, b) => a?.word?.localeCompare(b.word))
      : wordList;
  }, [wordList, isAlphabetical]);

  // Filtrar palabras según el texto ingresado y la letra seleccionada
  const filteredWords = useMemo(() => {
    return sortedWordList
      ?.filter((word) =>
        filterText.length >= 3
          ? word?.word?.toLowerCase().includes(filterText.toLowerCase())
          : true
      )
      .filter((word) =>
        selectedLetter === "All"
          ? true
          : word?.cefr_level && word.cefr_level.toUpperCase() === selectedLetter
      );
  }, [sortedWordList, filterText, selectedLetter]);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredWords?.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredWords, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1); // Restablece la página actual a la primera
  }, [filterText, selectedLetter, isAlphabetical]);

  return (
    <div>
      <section className="flex items-center justify-center min-h-screen">
        <div className="bg-[#f0f0f0] p-8 relative max-w-[1000px] w-full">
          <span className="text-black text-xs absolute top-2.5 left-2.5">
            Palabras: {wordList?.length}
          </span>
          <h1 className="text-center mb-5 text-[#252525] text-5xl mt-1 font-semibold">
            Practice English Words
          </h1>
          <div className="flex justify-center mb-3">
            <input
              type="text"
              onChange={(e) => setFilterText(e.target.value)}
              className="input w-full rounded-md me-2"
              placeholder="Filter words (min 3 character)"
            />
            <select
              value={selectedLetter}
              onChange={(e) => setSelectedLetter(e.target.value)}
              className="select rounded-md w-full"
            >
              <option disabled={true}>Filter by level</option>
              {["All", "A1", "A2", "B1", "B2", "C1", "C2"].map((lvl, i) => (
                <option key={i} value={lvl}>
                  {lvl}
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
          <div className="rounded-sm h-96 overflow-y-scroll text-black mx-auto w-full border border-gray-300">
            <ul className="grid grid-cols-1 md:grid-cols-2">
              {currentItems?.map((word) => (
                <WordItem
                  key={word.id}
                  word={word}
                  onEdit={openEditModal}
                  onDetails={handleGetOneDataWord}
                  onLearned={handleMarkLearned}
                  onHideWord={handleHideWord}
                  isChecked={isChecked.includes(word.id)}
                />
              ))}
           
            </ul>
          </div>
          <div className="bg-gray-400 pt-3 px-3 mt-4 rounded-xl">
            <div className="flex overflow-x-scroll w-full">
              {Array.from(
                { length: Math.ceil(filteredWords?.length / itemsPerPage) },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`btn btn-sm mx-1 ${
                      currentPage === i + 1 ? "btn-primary" : "btn-dark"
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
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
              onClick={() =>
                document.getElementById("add_word_modal").showModal()
              }
            >
              Add Word
            </button>
          </div>
          <ModalDetail oneDataWord={oneDataWord} />
          {/* Modal to Add Word */}
          <ModalAddWord
            level={level}
            setLevel={setLevel}
            word={word}
            setWord={setWord}
            meaning={meaning}
            setMeaning={setMeaning}
            handleAddWord={handleAddWord}
            description={description}
            setDescription={setDescription}
          />
          {/* Modal to Edit Word */}
          <ModalEditWord
            editWord={editWord}
            setEditWord={setEditWord}
            editMeaning={editMeaning}
            setEditMeaning={setEditMeaning}
            handleUpdateWord={handleUpdateWord}
            editDescription={editDescription}
            setEditDescription={setEditDescription}
            editLevel={editLevel} 
            setEditLevel={setEditLevel}
          />
        </div>
      </section>
      <section className="bg-[#1b1b1d] flex items-center justify-center min-h-screen relative">
        <div className="absolute top-0 left-0 m-5 font-semibold">
          Correct Answers: {countCorrectAnswers}
        </div>
        <div className="w-full max-w-3xl px-4">
          <div className="mb-6">
            <h2 className="text-white text-xl md:text-2xl font-semibold text-center">
              {`¿Cuál es el significado de "${randomWord?.word}"?`}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getAnswers.map((answer) => {
              return (
                <button
                  key={answer.id}
                  onClick={() => {
                    setSelectedAnswer(answer),
                      setCountCorrectAnswers((c) =>
                        answer.id == randomWord.id ? c + 1 : c
                      );
                  }}
                  type="button"
                  className={`${
                    Object.keys(selectedAnswer).length > 0
                      ? answer.id == randomWord.id
                        ? "bg-green-500"
                        : "bg-red-500"
                      : "bg-gray-600"
                  } text-white p-3 min-h-16 rounded-lg text-sm transition-all duration-300 hover:brightness-125 cursor-pointer`}
                >
                  {answer.meaning}
                </button>
              );
            })}
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={fetchRandomWord}
              className="btn btn-primary"
              disabled={Object.keys(selectedAnswer).length === 0} // Deshabilitar si no se ha seleccionado una respuesta
            >
              Next Word
            </button>
          </div>
          <div className="mt-6 font-semibold overflow-auto h-60 border rounded-lg p-4">
            {Object.keys(selectedAnswer).length > 0 && (
              <>
                <h1 className="text-center text-lg mb-3">Descripción</h1>
                <p className="text-justify bold">
                  {selectedAnswer.description
                    ?.split("\n")
                    .map((paragraph, index) => (
                      <React.Fragment key={index}>
                        {paragraph}
                        {index <
                          oneDataWord?.description?.split("\n").length - 1 && (
                          <br />
                        )}
                      </React.Fragment>
                    ))}
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
