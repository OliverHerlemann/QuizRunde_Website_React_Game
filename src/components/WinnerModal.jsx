import { useQuizData } from "./QuizDataProvider.jsx";
import { useImperativeHandle, useRef } from "react";

const victoryAudio = new Audio("/sounds/success-fanfare-trumpets-pixabay.mp3");
victoryAudio.load();

export default function WinnerModal({
  playerOne,
  playerTwo,
  playerCount,
  ref,
  setPlayerOne,
  setPlayerTwo,
  soundOn,
}) {
  const { quizData, setQuizData } = useQuizData();
  const winnerModalRef = useRef();
  let winner;
  let loser;

  useImperativeHandle(ref, () => ({
    showModal: () => {
      winnerModalRef.current?.showModal();
      if (soundOn) {
        victoryAudio.currentTime = 0;
        victoryAudio.play();
      }
    },
    close: () => winnerModalRef.current?.close(),
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

  function handleBackClick() {
    setQuizData((prev) =>
      prev.map((quiz) => ({
        ...quiz,
        isActive: false,
        isSelected: false,
        quizStarted: false,
        content: quiz.content.map((q) => ({
          ...q,
          questionIsActive: false,
          questionFinished: false,
        })),
      }))
    );
    winnerModalRef.current?.close();
    setPlayerOne((prev) => ({
      ...prev,
      points: 0,
      selectedAnswer: null,
      isTimeToAnswer: true,
    }));

    setPlayerTwo((prev) => ({
      ...prev,
      points: 0,
      selectedAnswer: null,
      isTimeToAnswer: false,
    }));
  }

  return (
    <dialog ref={winnerModalRef} className="winner-modal">
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
              Du hast die Quizrunde mit {playerOne.points} Punkten beendet!
            </h3>
          </>
        )
      )}
      <button className="back" onClick={handleBackClick}>
        Zurück
      </button>
    </dialog>
  );
}
