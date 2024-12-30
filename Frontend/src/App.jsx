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
    wordList.sort(() => Math.random() - 0.5);
    setWordList((prev) => [...prev, { word: word, meaning: meaning }]);
    setWord("");
    setMeaning("");

    axios
      .post("http://localhost:3000/create-word", {
        word: word,
        meaning: meaning,
      })
      .then((response) => {
        setIsThereChangeWord(true);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
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
    // Shuffle the word list using Fisher-Yates shuffle+
    const shuffledList = [...wordList];
    for (let i = shuffledList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
    }
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
    <div className="App">
      <h1 className="title" style={{ textAlign: "center" }}>
        Practice English Words
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{
            borderRadius: "8px",
            marginRight: "8px",
            width: "80%",
            height: "35px",
          }}
          placeholder="Filter words"
        />
      </div>
      <div className="input-container">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          style={{ borderRadius: "8px", marginRight: "8px" }}
          placeholder="Type a new word"
        />
        <input
          type="text"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          style={{ borderRadius: "8px", marginRight: "8px" }}
          placeholder="Type the meaning"
        />
        <button onClick={handleAddWord}>Add</button>
      </div>
      <div
        className="word-list"
        style={{ color: "#000", overflow: "auto", height: "350px" }}
      >
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
                    style={{ cursor: "pointer" }}
                    onClick={() => handleMarkLearned(word.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={`${isChecked.includes(word.id) ? "green" : "gray"}`}
                      style={{
                        height: "20px",
                        width: "20px",
                        marginBottom: "-4px",
                      }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span style={{ fontWeight: "bold" }}>{word.word}:</span>{" "}
                    {word.meaning + " "}
                    <small>{`(${word.timeslearned})`}</small>
                  </li>
                ))
            : wordList?.slice(0, 20).map((word, index) => (
                <li
                  key={index}
                  type="button"
                  onClick={() => handleMarkLearned(word.id)}
                  style={{ cursor: "pointer" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={`${isChecked.includes(word.id) ? "green" : "gray"}`}
                    style={{
                      height: "20px",
                      width: "20px",
                      marginBottom: "-4px",
                    }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span style={{ fontWeight: "bold" }}>{word.word}:</span>{" "}
                  {word.meaning + " "}
                  <small>{`(${word.timeslearned})`}</small>
                </li>
              ))}
        </ul>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button style={{ marginTop: "20px" }} onClick={handleShuffleWords}>
          Shuffle
        </button>
        <button style={{ marginTop: "20px" }} onClick={downloadList}>
          Download
        </button>
      </div>
    </div>
  );
}

export default App;
