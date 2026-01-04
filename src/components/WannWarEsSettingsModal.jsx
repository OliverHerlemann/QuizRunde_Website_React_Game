import { useImperativeHandle, useRef } from "react";

export default function WannWarEsSettingsModal({ ref, setQuizModus }) {
  const WannWarEsSettingModalRef = useRef();

  useImperativeHandle(ref, () => ({
    showModal: () => WannWarEsSettingModalRef.current?.showModal(),
    close: () => WannWarEsSettingModalRef.current?.close(),
  }));

  function handleModalClick(clickType) {
    if (clickType === "cancel") {
      WannWarEsSettingModalRef.current?.close();
    } else if (clickType === "confirm") {
      WannWarEsSettingModalRef.current?.close();
      setQuizModus("WannWarEs");
    }
  }

  return (
    <>
      <dialog ref={WannWarEsSettingModalRef} className="setting-modal">
        <h3>Der "Wann war es?" Modus!</h3>
        <p>
          Hier müsst ihr Historische Ereignisse auf einem Zeitstrahl richtig
          einordnen.
        </p>
        <p>
          Ihr beginnt mit einem Ereignis und müsst dann in der ersten Runde
          entscheiden ob euer zufällig gezogenes Ereignis vor oder nach eurem
          Startereignis war. In den weiteren Runden wird es dann immer
          schwieriger nun müsst ihr nämlich entscheiden zwischen welchen eurer
          bereits richtig eingeordneten Ereignisse euer gezogenes Ereignis
          liegt. Wenn ihr falsch liegt verliert ihr das Ereignis und somit auch
          den Punkt!
        </p>
        <p>
          Das Spiel ist beendet wenn das erste Team 24 Punkte (pro richtig
          eingeordnetes Ereignis = ein Punkt) gesammelt hat.
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
