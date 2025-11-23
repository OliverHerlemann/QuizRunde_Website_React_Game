import { useState } from "react";
import { useQuizData } from "./QuizDataProvider.jsx";

export default function Settings({
  playerOne,
  playerTwo,
  setPlayerOne,
  setPlayerTwo,
  playerCount,
  setPlayerCount,
  showModal,
  showSettingsModal,
  pointStealerFactor,
}) {
  const { quizData, setQuizData } = useQuizData();
  const selectedIndex = quizData.findIndex((data) => data.isSelected === true);

  const [showQuizMsg, setShowQuizMsg] = useState(false);

  function handleAddPlayer() {
    setPlayerCount((prevCount) => prevCount + 1);
    setPlayerTwo((prev) => ({ ...prev, isSet: true }));
  }

  function handleCancelPlayer() {
    setPlayerCount((prevCount) => prevCount - 1);
    setPlayerTwo((prev) => ({ ...prev, isSet: false }));
  }

  function handleChangeName(event, player) {
    const newName = event.target.value;
    if (player === "playerOne") {
      setPlayerOne((prev) => ({ ...prev, name: newName }));
    } else if (player === "playerTwo") {
      setPlayerTwo((prev) => ({ ...prev, name: newName }));
    }
  }
  function handleStart() {
    setShowQuizMsg(true);
    if (selectedIndex !== -1) {
      if (quizData[selectedIndex].isSelected) {
        const updatedQuizData = quizData.map((item, index) => ({
          ...item,
          quizStarted: index === selectedIndex,
        }));
        setQuizData(updatedQuizData);
        //Set quiz[index].isSelected zu true! Mit, [index]isActive istt true, dann den isSelected zu true
      }
    }
  }
  function handleQuizClick(index) {
    const updatedQuizData = quizData.map((item, i) => ({
      ...item,
      isActive: i === index, // nur der angeklickte Index wird true
    }));
    setQuizData(updatedQuizData);
    showModal();
  }

  return (
    <>
      <section id="player-count">
        <h3>Spieler/Team Auswahl</h3>
        <input
          value={playerOne.name}
          className="player"
          onChange={(event) => handleChangeName(event, "playerOne")}
        />
        {playerCount === 2 && (
          <div className="input-grp">
            <input
              value={playerTwo.name}
              className="player play-2"
              onChange={(event) => handleChangeName(event, "playerTwo")}
            />
            <button onClick={handleCancelPlayer} className="X">
              X
            </button>
          </div>
        )}
        {playerCount <= 1 && (
          <button className="player" onClick={handleAddPlayer}>
            + Hinzufügen
          </button>
        )}
      </section>
      <section className="quiz-selection">
        <h3>Quiz Auswahl</h3>
        <ol>
          {quizData.map((item, index) => (
            <li key={index} className={item.isSelected ? "active" : ""}>
              <button onClick={() => handleQuizClick(index)}>
                {item.name}
              </button>
            </li>
          ))}
        </ol>
      </section>
      <section className="others">
        <h3>Sonstige Einstellungen</h3>
        <button onClick={showSettingsModal}>
          Punkte klauen: {pointStealerFactor}%
        </button>
      </section>
      {selectedIndex === -1 && showQuizMsg && (
        <p id="showQuizMsg">Bitte wähle ein Quiz aus.</p>
      )}
      <button id="start-button" onClick={handleStart}>
        Quiz starten
      </button>
    </>
  );
}
