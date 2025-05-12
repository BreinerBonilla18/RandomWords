import PropTypes from "prop-types"
import React from "react"

function ModalDetail({oneDataWord}) {
  return (
          <dialog id="detail_modal" className="modal">
            <div className="modal-box">
              <div className="flex flex-col mt-4 gap-3">
                <h1 className="text-2xl mb-1 fw font-bold">
                  {oneDataWord?.word}
                </h1>
                <p className="mb-1">
                  <span className="font-semibold">Significado:</span>{" "}
                  {oneDataWord?.meaning}
                </p>
                <p className="text-justify">
                  <span className="font-semibold">Descripción:</span>{" "}
                  {oneDataWord?.description
                    ?.split("\n")
                    .map((paragraph, index) => (
                      <React.Fragment key={index}>
                        {paragraph}
                        {index <
                          oneDataWord.description.split("\n").length - 1 && (
                          <br />
                        )}
                      </React.Fragment>
                    ))}
                </p>
              </div>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
  )
}

ModalDetail.propTypes = {
    oneDataWord: PropTypes.object
}

export default ModalDetail
