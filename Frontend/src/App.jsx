import { useEffect, useState } from "react";
import "./App.css"; // Importa tu archivo CSS
import axios from "axios";
import { saveAs } from "file-saver";

function App() {
  const [word, setWord] = useState("");
  const [wordList, setWordList] = useState([]);
  const [isThereChangeWord, setIsThereChangeWord] = useState(false);
  const [meaning, setMeaning] = useState("");
  const [filterText, setFilterText] = useState("");
  const [isChecked, setIsChecked] = useState([]);

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
      await axios.put(`http://localhost:3000/update-word/${wordId}`);
      setIsThereChangeWord(true); // Trigger refetch on word list update
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

  return (
    <div className="bg-[#f0f0f0] p-8 relative">
      <span className="text-black text-xs absolute top-2.5 left-2.5">
        Palabras: {wordList.length}
      </span>
      <h1 className="text-center mb-5 text-[#252525] text-5xl mt-1 font-semibold">
        Practice English Words
      </h1>
      <div className="flex justify-center mb-5">
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="rounded-lg mr-2 bg-[#252525] p-3 w-full"
          placeholder="Filter words"
        />
      </div>
      <div className="flex justify-center mb-5">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="bg-[#252525] p-3 rounded-lg mr-2"
          placeholder="Type a new word"
        />
        <input
          type="text"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          className="bg-[#252525] p-3 rounded-lg mr-2"
          placeholder="Type the meaning"
        />
        <button onClick={handleAddWord}>Add</button>
      </div>
      <div className="rounded-sm h-80 overflow-auto text-black p-4 mx-auto max-w-[500px] border border-gray-300">
        <ul>
          {filterText !== ""
            ? wordList
                .filter((word) =>
                  word.word.toLowerCase().includes(filterText.toLowerCase())
                )
                .map((word, index) => (
                  <li
                    key={index}
                    type="button"
                    className="cursor-pointer hover:bg-[#cfcece]"
                    onClick={() => handleMarkLearned(word.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={`${isChecked.includes(word.id) ? "green" : "gray"}`}
                      className="mb-0.5 h-5 w-5 inline"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clipRule="evenodd"
                      />
                    </svg>{" "}
                    <span className="font-semibold">{word.word}:</span>{" "}
                    {word.meaning + " "}
                    <small>{`(${word.timeslearned})`}</small>
                  </li>
                ))
            : wordList?.slice(0, 20).map((word, index) => (
                <li
                  key={index}
                  type="button"
                  className="cursor-pointer hover:bg-[#cfcece]"
                  onClick={() => handleMarkLearned(word.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={`${isChecked.includes(word.id) ? "green" : "gray"}`}
                    className="mb-0.5 h-5 w-5 inline"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                      clipRule="evenodd"
                    />
                  </svg>{" "}
                  <span className="font-semibold">{word.word}:</span>{" "}
                  {word.meaning + " "}
                  <small>{`(${word.timeslearned})`}</small>
                </li>
              ))}
        </ul>
      </div>
      <div className="flex justify-center gap-2.5">
        <button className="mt-5" onClick={handleShuffleWords}>
          Shuffle
        </button>
        <button className="mt-5" onClick={downloadList}>
          Download
        </button>
      </div>
    </div>
  );
}

export default App;
