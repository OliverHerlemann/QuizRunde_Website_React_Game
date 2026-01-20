import PlayerInfoBox from "./PlayerInfoBox.jsx";

export default function Header({
  quizActive,
  playerOne,
  playerTwo,
  playerCount,
  soundOn,
  setSoundOn,
  startQuiz
}) {
  function toggleSound() {
    setSoundOn(!soundOn);
  }

  return (
    <header>
      <button onClick={toggleSound}>
        {soundOn ? "Ton ausschalten" : "Ton einschalten"}
      </button>
      <h1>QUIZ RUNDE</h1>
      <div className="header-div">
        {(quizActive || startQuiz) ? (
          <PlayerInfoBox
            playerOne={playerOne}
            playerTwo={playerTwo}
            playerCount={playerCount}
          />
        ) : null}
      </div>
    </header>
  );
}
