import PropTypes from "prop-types";

function ModalAddWord({ word, setWord, meaning, setMeaning, handleAddWord }) {
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
  setMeaning: PropTypes.func,
  setWord: PropTypes.func,
  meaning: PropTypes.string,
  word: PropTypes.string,
};

export default ModalAddWord;
