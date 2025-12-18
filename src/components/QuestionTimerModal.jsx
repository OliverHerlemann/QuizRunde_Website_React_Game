import { useImperativeHandle, useRef } from "react";

export default function QuestionTimerModal({
  questionTime,
  setQuestionTime,
  ref,
}) {
  const questionTimerModalRef = useRef();

  useImperativeHandle(ref, () => ({
    showModal: () => {
      questionTimerModalRef.current?.showModal();
    },
    close: () => questionTimerModalRef.current?.close(),
  }));

  function handleOnClick() {
    setQuestionTime(45);
  }
  function handleTunrOff() {
    setQuestionTime(null);
    questionTimerModalRef.current?.close();
  }
  function handleGoBack() {
    questionTimerModalRef.current?.close();
  }

  function handleChangeTime(event) {
    setQuestionTime(event.target.value);
  }

  return (
    <dialog ref={questionTimerModalRef}>
      <h3>Fragen-Timer setzen</h3>
      {questionTime === null && (
        <>
          <p className="para-center">
            Möchtest du einen Fragen-Timer einstellen?
          </p>
          <div className="modal-actions">
            <button onClick={handleGoBack} className="cancel">
              Zurück
            </button>
            <button className="confirm" onClick={handleOnClick}>
              Einstellen
            </button>
          </div>
        </>
      )}
      {questionTime !== null && (
        <>
          <p className="para-center">
            Der Spieler der am Zug ist hat die gesetzte Timer Zeit zum
            Antworten.{" "}
          </p>
          <p>
            Der Spieler welcher in der jeweiligen Runde als zweites dran ist hat
            nach der Antwort des ersten Spielers nur noch 15s Zeit zum
            Antworten.
          </p>
          <p className="para-center">Zeit in Sekunden:</p>
          <input
            id="question-time"
            value={questionTime}
            type="number"
            onChange={handleChangeTime}
          />
          <div className="modal-actions">
            <button onClick={handleTunrOff} className="cancel">
              Ausschalten
            </button>
            <button
              onClick={() => questionTimerModalRef.current?.close()}
              className="confirm"
            >
              Bestätigen
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
