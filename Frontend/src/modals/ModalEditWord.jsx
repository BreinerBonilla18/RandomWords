import PropTypes from "prop-types";

function ModalEditWord({
  editWord,
  setEditWord,
  editMeaning,
  setEditMeaning,
  handleUpdateWord,
  editDescription,
  setEditDescription,
  editLevel, 
  setEditLevel,
}) {
  const levelsCEFR = ["A1", "A2", "B1", "B2", "C1", "C2"];
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
          <textarea
            className="textarea w-full rounded-md h-72"
            placeholder="Edit description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          ></textarea>
          <select
            defaultValue="Select CEFR"
            className="select w-full rounded-md"
            value={editLevel}
            onChange={(e) => setEditLevel(e.target.value)}
          >
            <option disabled={true}>Select CEFR</option>
            {levelsCEFR.map((lvl, i) => (
              <option key={i} value={lvl}>{lvl}</option>
            ))}
          </select>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={handleUpdateWord}>
            Save
          </button>
          <form method="dialog">
            <button className="btn" onClick={() => {setEditDescription(""), setEditLevel("")}}>Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

ModalEditWord.propTypes = {
  handleUpdateWord: PropTypes.func,
  setEditDescription: PropTypes.func,
  setEditMeaning: PropTypes.func,
  setEditLevel: PropTypes.func,
  setEditWord: PropTypes.func,
  editMeaning: PropTypes.string,
  editWord: PropTypes.string,
  editDescription: PropTypes.string,
  editLevel: PropTypes.string,
};

export default ModalEditWord;
