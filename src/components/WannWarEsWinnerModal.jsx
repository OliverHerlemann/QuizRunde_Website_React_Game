import { useImperativeHandle, useRef } from "react";
import { WannWarEsData } from "../WannWarEsData";

const victoryAudio = new Audio("/sounds/success-fanfare-trumpets-pixabay.mp3");
victoryAudio.load();

export default function WannWarEsWinnerModal({
  playerOne,
  playerTwo,
  playerCount,
  ref,
  setPlayerOne,
  setPlayerTwo,
  soundOn,
  setQuizModus,
  setStartQuiz,
  setEreignisArrays,
}) {
  const WWEwinnerModalRef = useRef();
  let winner;
  let loser;
  const zufallsIndexPlayerOne = Math.floor(
    Math.random() * WannWarEsData.length
  );
  let zufallsIndexPlayerTwo;
  do {
    zufallsIndexPlayerTwo = Math.floor(Math.random() * WannWarEsData.length);
  } while (zufallsIndexPlayerTwo === zufallsIndexPlayerOne);

  useImperativeHandle(ref, () => ({
    showModal: () => {
      WWEwinnerModalRef.current?.showModal();
      if (soundOn) {
        victoryAudio.currentTime = 0;
        victoryAudio.play();
      }
    },
    close: () => WWEwinnerModalRef.current?.close(),
  }));

  if (playerCount > 1 && playerOne.points >= playerTwo.points) {
    winner = playerOne;
    loser = playerTwo;
  } else {
    winner = playerTwo;
    loser = playerOne;
  }
  const winnerProcent = Math.ceil((winner.points / loser.points) * 100 - 100);
  const morePointsIs = winner.points - loser.points;

  function handleModalClick(clickType) {
    if (clickType === "cancel") {
      WWEwinnerModalRef.current?.close();
      setPlayerOne((prev) => ({
        ...prev,
        points: 0,
        isTimeToAnswer: true,
      }));

      setPlayerTwo((prev) => ({
        ...prev,
        points: 0,
        isTimeToAnswer: false,
      }));
      setStartQuiz(undefined);
      setQuizModus(undefined);
      setEreignisArrays({
        playerOne: [-1, zufallsIndexPlayerOne, -1],
        playerTwo: [-1, zufallsIndexPlayerTwo, -1],
      });
    } else if (clickType === "confirm") {
      WWEwinnerModalRef.current?.close();
    }
  }

  return (
    <dialog ref={WWEwinnerModalRef} className="winner-modal">
      {" "}
      {winner.points === loser.points && (
        <>
          <img src="/photos/champion_cup.png" alt="A golden champion cup" />
          <h3>Es gibt ein Unentschieden!</h3>
          <p className="winner">Beide Spieler haben {loser.points} Punkte.</p>
        </>
      )}
      {playerCount > 1 && winner.points !== loser.points ? (
        <>
          <img src="/photos/champion_cup.png" alt="A golden champion cup" />
          <h3>
            {winner.name} hat die Quizrunde mit {winner.points} Punkten
            gewonnen!
          </h3>
          <p className="winner">
            {loser.name} hat {loser.points} Punkte.
          </p>
          <p className="winner">
            {winner.name} hat {morePointsIs} Punkte mehr als {loser.name} das
            sind {winnerProcent} % mehr!
          </p>{" "}
        </>
      ) : (
        winner.points !== loser.points && (
          <>
            <img src="/photos/champion_cup.png" alt="A golden champion cup" />
            <h3>
              Du hast den "Wann war es?" Modus mit {playerOne.points} Punkten
              beendet!
            </h3>
          </>
        )
      )}
      <div className="modal-actions">
        <button className="cancel" onClick={() => handleModalClick("cancel")}>
          Zurück
        </button>
        <button className="confirm" onClick={() => handleModalClick("confirm")}>
          OK
        </button>
      </div>
    </dialog>
  );
}
