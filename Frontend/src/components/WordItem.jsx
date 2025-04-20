import PropTypes from "prop-types"

function WordItem({ word, onEdit, onDetails, onLearned, isChecked }) {
  return (
    <li className="p-3 border-b border-gray-300">
      <p className="font-semibold">{word.word}:</p>
      <p className="mb-2">{word.meaning}</p>
      <div className="flex justify-end gap-2">
        <button className="btn btn-xs" onClick={() => onEdit(word)}>
          Edit
        </button>
        <button
          className="btn btn-xs bg-blue-950"
          onClick={() => onDetails(word)}
        >
          Details
        </button>
        <button
          className={`btn btn-xs ${isChecked ? "bg-green-700" : "bg-gray-700"}`}
          onClick={() => onLearned(word.id)}
        >
          Learned({word.timeslearned})
        </button>
      </div>
    </li>
  );
}

WordItem.propTypes = {
    word: PropTypes.object,
    onEdit: PropTypes.func,
    onDetails: PropTypes.func,
    onLearned: PropTypes.func,
    isChecked: PropTypes.bool
}

export default WordItem;
