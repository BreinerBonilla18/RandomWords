import { useEffect, useState } from 'react';
import './App.css'; // Importa tu archivo CSS
import axios from 'axios';

function App() {
  const [word, setWord] = useState('');
  const [wordList, setWordList] = useState([]);
  const [isThereChangeWord,setIsThereChangeWord] = useState(false)

  console.log(word)
  const handleAddWord = () => {
    if (!word) {
      alert('Por favor, ingresa una palabra');
      return;
  }

  setWordList((prev) => [...prev, word]);
  setWord('');

    axios.post('http://localhost:3000/create-word', { word: word })
    .then(response => {
      setIsThereChangeWord(true)
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });

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
        const response = await axios.get('http://localhost:3000/words');
        const shuffledWords = response.data 
        setWordList(shuffledWords);
        setIsThereChangeWord(false)
      } catch (error) {
        console.error(error);
      }
    };

    fetchWords();
  }, [isThereChangeWord]);

  return (
    <div className="App">
      <h1 className="title">Practice English Words</h1>
      <div className="input-container">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          style={{borderRadius:"8px", marginRight:"8px"}}
          placeholder="Type a new word"
        />
        <button onClick={handleAddWord}>Add</button>
      </div>
      <div className="word-list" style={{color:"#000"}}>
        <ul>
          {wordList?.slice(0, 10).sort(() => Math.random() - 0.5).map((word, index) => (
            <li key={index}>{word.word}</li>
          ))}
        </ul>
      </div>
      <button style={{marginTop:"20px"}} onClick={handleShuffleWords}>Shuffle</button>
    </div>
  );
}

export default App;