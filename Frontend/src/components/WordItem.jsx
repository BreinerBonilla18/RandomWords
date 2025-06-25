import PropTypes from "prop-types";
import { FaEdit, FaEyeSlash } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";

function WordItem({
  word,
  onEdit,
  onDetails /* , onLearned, isChecked,  */,
  onHideWord,
}) {
  return (
    <li className="p-3 shadow">
      <p className="font-semibold">{word.word}:</p>
      <p className="mb-2">{word.meaning}</p>
      <div className="flex justify-end gap-2">
        <button
          className="btn btn-xs bg-black"
          onClick={() => onHideWord(word.id, true)}
        >
          <FaEyeSlash/>
        </button>
        <button className="btn btn-xs" onClick={() => onEdit(word)}>
          <FaEdit />
        </button>
        <button
          className="btn btn-xs bg-blue-950"
          onClick={() => onDetails(word)}
        >
         <IoIosInformationCircleOutline/>
        </button>
        {/* <button
          className={`btn btn-xs ${isChecked ? "bg-green-700" : "bg-gray-700"}`}
          onClick={() => onLearned(word.id)}
        >
          Learned({word.timeslearned})
        </button> */}
      </div>
    </li>
  );
}

WordItem.propTypes = {
  word: PropTypes.object,
  onHideWord: PropTypes.func,
  onEdit: PropTypes.func,
  onDetails: PropTypes.func,
  onLearned: PropTypes.func,
  isChecked: PropTypes.bool,
};

export default WordItem;
