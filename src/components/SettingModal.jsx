import { useImperativeHandle, useRef } from "react";

export default function SettingModal({
  setPointStealerFactor,
  pointStealerFactor,
  ref,
}) {
  const settingModalRef = useRef();
  const previousValueRef = useRef(null);

  useImperativeHandle(ref, () => ({
    showModal: () => {
      previousValueRef.current = pointStealerFactor; // alten Wert merken
      settingModalRef.current?.showModal();
    },
    close: () => settingModalRef.current?.close(),
  }));

  function handleModalClick(clickType) {
    if (clickType === "cancel") {
      settingModalRef.current?.close();
      setPointStealerFactor(previousValueRef.current);
    } else if (clickType === "confirm") {
      settingModalRef.current?.close();
    }
  }
  function handleStealFactorChange(event) {
    let value = Number(event.target.value);

    if (value < 0) value = 0;
    if (value > 300) value = 300;

    setPointStealerFactor(value);
  }

  return (
    <>
      <dialog ref={settingModalRef} className="setting-modal">
        <h3>Punkte klauen: Faktor festlegen</h3>
        <p>(Nur relevant bei zwei Spielern)</p>
        <p>Gebe in das Eingabefeld den Faktor in % ein: (0 bis 300)</p>
        <input
          type="number"
          min={0}
          max={300}
          value={pointStealerFactor}
          onChange={handleStealFactorChange}
        />
        <p>
          Info: Bei der letzten Frage bekommen immer beide Teams die vollen
          Punkte bei einer korrekten Antwort.
        </p>
        <div className="modal-actions">
          <button className="cancel" onClick={() => handleModalClick("cancel")}>
            Abbrechen
          </button>
          <button
            className="confirm"
            onClick={() => handleModalClick("confirm")}
          >
            Bestätigen
          </button>
        </div>
      </dialog>
    </>
  );
}
