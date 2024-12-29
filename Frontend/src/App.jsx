import { useEffect, useState } from "react";
import "./App.css"; // Importa tu archivo CSS
import axios from "axios";
import { saveAs } from 'file-saver';

function App() {
  const [word, setWord] = useState("");
  const [wordList, setWordList] = useState([]);
  const [isThereChangeWord, setIsThereChangeWord] = useState(false);
  const [meaning, setMeaning] = useState("");
  const [filterText, setFilterText] = useState("");

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

  const downloadList = () => {
    const wordData = wordList.map((word) => `${word.word}: ${word.meaning}\n`).join('');
    const blob = new Blob([wordData], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'word_list.txt');
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
      <div style={{display:"flex", justifyContent:"center", marginBottom:"20px"}}>
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ borderRadius: "8px", marginRight: "8px", width:"80%", height:"35px" }}
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
      <div className="word-list" style={{ color: "#000", overflow:"auto", height: "350px" }}>
        <ul>
          {filterText !== ""
            ? wordList
                .filter((word) =>
                  word.word.toLowerCase().includes(filterText.toLowerCase())
                )
                .map((word, index) => (
                  <li key={index}>
                    <span style={{ fontWeight: "bold" }}>{word.word}:</span>{" "}
                    {word.meaning}
                  </li>
                ))
            : wordList?.slice(0, 20).map((word, index) => (
                <li key={index}>
                  <span style={{ fontWeight: "bold" }}>{word.word}:</span>{" "}
                  {word.meaning}
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
