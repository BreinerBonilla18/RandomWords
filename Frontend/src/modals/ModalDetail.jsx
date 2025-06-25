import PropTypes from "prop-types";
import React from "react";

function ModalDetail({ oneDataWord }) {
  return (
    <dialog id="detail_modal" className="modal">
      <div className="modal-box pt-0 w-11/12 max-w-5xl">
        <div className="bg-blue-800 mt-5 p-2 flex justify-center items-center mb-2 sticky top-0">
          <h1 className="text-2xl font-bold">{oneDataWord?.cefr_level}</h1>
        </div>
        <div className="flex flex-col mt-4 gap-3">
          <h1 className="text-2xl mb-1 fw font-bold">{oneDataWord?.word} </h1>
          <p className="mb-1">
            <span className="font-semibold">Significado:</span>{" "}
            {oneDataWord?.meaning}
          </p>
          <p className="text-justify">
            <span className="font-semibold">Descripción:</span>{" "}
            {oneDataWord?.description?.split("\n").map((paragraph, index) => (
              <React.Fragment key={index}>
                {paragraph}
                {index < oneDataWord.description.split("\n").length - 1 && (
                  <br />
                )}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

ModalDetail.propTypes = {
  oneDataWord: PropTypes.object,
};

export default ModalDetail;
