import PropTypes from "prop-types";

function ModalEditWord({
  editWord,
  setEditWord,
  editMeaning,
  setEditMeaning,
  handleUpdateWord,
}) {
  return (
    <dialog id="edit_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Word</h3>
        <div className="flex flex-col gap-4 mt-4">
          <input
            type="text"
            value={editWord}
            onChange={(e) => setEditWord(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Edit word"
          />
          <input
            type="text"
            value={editMeaning}
            onChange={(e) => setEditMeaning(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Edit meaning"
          />
        </div>
        <div className="modal-action">
          <button className="btn" onClick={handleUpdateWord}>
            Save
          </button>
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

ModalEditWord.propTypes = {
    handleUpdateWord: PropTypes.func,
    setEditMeaning: PropTypes.func,
    setEditWord: PropTypes.func,
    editMeaning: PropTypes.string,
    editWord: PropTypes.string,
};

export default ModalEditWord;
