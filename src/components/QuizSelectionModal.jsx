import { useQuizData } from "./QuizDataProvider.jsx";
import { useImperativeHandle, useRef } from "react";

export default function QuizSelectionModal({ ref, setQuizModus }) {
  const { quizData, setQuizData } = useQuizData();

  const dialogRef = useRef();
  const activeIndex = quizData.findIndex((Data) => Data.isActive === true);

  useImperativeHandle(ref, () => ({
    showModal: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  function handleModalClick(type) {
    if (type === "confirm") {
      const updatedQuizData = quizData.map((item, i) => ({
        ...item,
        isSelected: i === activeIndex, // nur der angeklickte Index wird true
      }));
      setQuizData(updatedQuizData);
      setQuizModus(null);
      dialogRef.current?.close();
    } else if (type === "cancel") {
      dialogRef.current?.close();
    }
  }
  return (
    <dialog ref={dialogRef} className="selection-modal">
      <h3>Auswahl Bestätigen</h3>
      <p>
        Du hast das Quiz{" "}
        <strong>
          {activeIndex !== -1 ? quizData[activeIndex].name : "unbekannt"}
        </strong>{" "}
        ausgewählt.
      </p>
      <p>Mit folgenden Kategorien:</p>
      <ol>
        <li>
          {activeIndex !== -1
            ? quizData[activeIndex].content[0].category
            : "unbekannt"}
        </li>
        <li>
          {activeIndex !== -1
            ? quizData[activeIndex].content[5].category
            : "unbekannt"}
        </li>
        <li>
          {activeIndex !== -1
            ? quizData[activeIndex].content[10].category
            : "unbekannt"}
        </li>
        <li>
          {activeIndex !== -1
            ? quizData[activeIndex].content[15].category
            : "unbekannt"}
        </li>
        <li>
          {activeIndex !== -1
            ? quizData[activeIndex].content[20].category
            : "unbekannt"}
        </li>
      </ol>
      <p>
        Das Quiz wurde von{" "}
        {activeIndex !== -1 ? quizData[activeIndex].madeBy : "unbekannt"}{" "}
        erstellt.
      </p>
      <div className="modal-actions">
        <button className="cancel" onClick={() => handleModalClick("cancel")}>
          Abbrechen
        </button>
        <button className="confirm" onClick={() => handleModalClick("confirm")}>
          Bestätigen
        </button>
      </div>
    </dialog>
  );
}
