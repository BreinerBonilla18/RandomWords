import PropTypes from "prop-types";

function ModalAddWord({
  word,
  setWord,
  meaning,
  setMeaning,
  description,
  setDescription,
  handleAddWord,
  level, 
  setLevel
}) {
  const levelsCEFR = ["A1", "A2", "B1", "B2", "C1", "C2"];
  return (
    <dialog id="add_word_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add Word</h3>
        <div className="flex flex-col gap-4 mt-4">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="input w-full rounded-md"
            placeholder="Type a new word"
          />
          <input
            type="text"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            className="input w-full rounded-md"
            placeholder="Type the meaning"
          />
          <textarea
            className="textarea w-full rounded-md h-72"
            placeholder="Type the description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <select
            defaultValue="Select CEFR"
            className="select w-full rounded-md"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option disabled={true}>Select CEFR</option>
            {levelsCEFR.map((lvl, i) => (
              <option key={i} value={lvl}>{lvl}</option>
            ))}
          </select>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={handleAddWord}>
            Add
          </button>
          <form method="dialog">
            <button className="btn" onClick={handleAddWord}>
              Add and close
            </button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

ModalAddWord.propTypes = {
  handleAddWord: PropTypes.func,
  setDescription: PropTypes.func,
  setMeaning: PropTypes.func,
  setLevel: PropTypes.func,
  setWord: PropTypes.func,
  description: PropTypes.string,
  meaning: PropTypes.string,
  level: PropTypes.string,
  word: PropTypes.string,
};

export default ModalAddWord;
