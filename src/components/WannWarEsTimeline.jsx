import { useEffect } from "react";
import { WannWarEsData } from "../WannWarEsData.jsx";

const correctSound = new Audio("/sounds/Cha_Ching_Pixabay.mp3");
const wrongSound = new Audio(
  "/sounds/gameshow_buzzer_incorrect_buzz_zapsplat.mp3"
);
correctSound.load();
wrongSound.load();

export default function WannWarEsTimeline({
  playerCount,
  ereignis,
  setEreignis,
  ereignisArrays,
  setEreignisArrays,
  setPlayerOne,
  setPlayerTwo,
  playerOne,
  playerTwo,
  setActivePlayer,
  setEreignisTrigger,
  showWWEWinnerModal,
}) {
  const MONTHS = {
    januar: 1,
    februar: 2,
    märz: 3,
    april: 4,
    mai: 5,
    juni: 6,
    juli: 7,
    august: 8,
    september: 9,
    oktober: 10,
    november: 11,
    dezember: 12,
  };

  useEffect(() => {
    // Singleplayer sofort beenden
    if (playerCount === 1) {
      if (playerOne.points >= 2) {
        showWWEWinnerModal();
      }
      return;
    }
  
    // Multiplayer:
    // Spiel endet nur, wenn jemand 2 Punkte hat
    // UND der andere Spieler gerade NICHT mehr am Zug ist
    if (
      (playerOne.points >= 2 && !playerTwo.isTimeToAnswer) ||
      (playerTwo.points >= 2)
    ) {
      showWWEWinnerModal();
    }
  }, [
    playerOne.points,
    playerTwo.points,
    playerOne.isTimeToAnswer,
    playerTwo.isTimeToAnswer,
    playerCount,
  ]);

  useEffect(() => {
    setPlayerOne((prev) => ({ ...prev, points: 1 }));
    setPlayerTwo((prev) => ({ ...prev, points: 1 }));
  }, []);

  function isPlayersTurn(player, playerOne, playerTwo) {
    if (player === "playerOne") return playerOne.isTimeToAnswer;
    if (player === "playerTwo") return playerTwo.isTimeToAnswer;
    return false;
  }

  function parseHistoricDate(dateString) {
    const isBC = dateString.includes("v. Chr");

    // Tag
    const dayMatch = dateString.match(/^(\d{1,2})\./);
    const day = dayMatch ? parseInt(dayMatch[1], 10) : 1;

    // Monat
    const monthMatch = dateString
      .toLowerCase()
      .match(
        /(januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember)/
      );
    const month = monthMatch ? MONTHS[monthMatch[1]] : 1;

    // Jahr
    const yearMatch = dateString.match(/(\d{1,4})/g);
    const year = yearMatch ? parseInt(yearMatch[yearMatch.length - 1], 10) : 0;

    // Zeitwert bauen (Tag-genau!)
    const value = year * 10_000 + month * 100 + day;

    return isBC ? -value : value;
  }

  function switchTurn() {
    if (playerCount === 1) return; // 🎯 SINGLEPLAYER: nix wechseln

    setPlayerOne((prev) => ({
      ...prev,
      isTimeToAnswer: !prev.isTimeToAnswer,
    }));

    setPlayerTwo((prev) => ({
      ...prev,
      isTimeToAnswer: !prev.isTimeToAnswer,
    }));

    setActivePlayer((prev) =>
      prev === "playerOne" ? "playerTwo" : "playerOne"
    );
  }

  function isCorrectPosition({ ereignisIndex, array, insertIndex }) {
    const newValue = parseHistoricDate(WannWarEsData[ereignisIndex].date);

    // linker Nachbar
    const leftIndex = [...array.slice(0, insertIndex)]
      .reverse()
      .find((v) => v !== -1);

    // rechter Nachbar
    const rightIndex = array.slice(insertIndex + 1).find((v) => v !== -1);

    const leftValue =
      leftIndex !== undefined
        ? parseHistoricDate(WannWarEsData[leftIndex].date)
        : Infinity;

    const rightValue =
      rightIndex !== undefined
        ? parseHistoricDate(WannWarEsData[rightIndex].date)
        : -Infinity;

    // 🧠 ZEITLICH KORREKT
    return newValue < leftValue && newValue > rightValue;
  }

  function handleAddClick(player, index) {
    if (!ereignis) return;

    // ❌ falscher Spieler
    if (!isPlayersTurn(player, playerOne, playerTwo)) return;

    const ereignisIndex = WannWarEsData.findIndex(
      (e) => e.title === ereignis.title
    );

    const oldArray = ereignisArrays[player];

    const isCorrect = isCorrectPosition({
      ereignisIndex,
      array: oldArray,
      insertIndex: index,
    });

    // ❌ FALSCH
    if (!isCorrect) {
      wrongSound.currentTime = 0;
      wrongSound.volume = 0.6;
      wrongSound.play();

      setEreignis(null);
      setEreignisTrigger((t) => t + 1);
      if (playerCount > 1) {
        switchTurn();
      }
      return;
    }

    // ✅ RICHTIG
    correctSound.currentTime = 0;
    correctSound.play();

    setEreignisArrays((prev) => {
      const before = oldArray.slice(0, index + 1);
      const after = oldArray.slice(index + 1);

      return {
        ...prev,
        [player]: [...before, ereignisIndex, -1, ...after],
      };
    });

    // 🎯 Punkt für richtigen Spieler
    if (playerOne.isTimeToAnswer) {
      setPlayerOne((prev) => ({ ...prev, points: prev.points + 1 }));
    } else if (playerTwo.isTimeToAnswer) {
      setPlayerTwo((prev) => ({ ...prev, points: prev.points + 1 }));
    }

    setEreignis(null);
    setEreignisTrigger((t) => t + 1);
    if (playerCount > 1) {
      switchTurn();
    }
    
  }

  return (
    <section className="timeline-container">
      <div className="timeline-side">
        <p className="alpha-to-omega">Neuzeit</p>
        <div className="dot-line"></div>
        {ereignisArrays.playerOne.map((value, index) => {
          // FALL 1: Leerer Slot → Plus-Button
          if (value === -1) {
            return (
              <button
                key={index}
                className="timeline-add-btn"
                onClick={() => handleAddClick("playerOne", index)}
              >
                +
              </button>
            );
          }

          // FALL 2: Zahl → Ereignis anzeigen
          const event = WannWarEsData[value];

          return (
            <>
              <div className="solid-line"></div>
              <div key={index} className="timeline-event">
                <h4>{event.caption}</h4>
                <p className="event-date">{event.date}</p>
              </div>
              <div className="solid-line"></div>
            </>
          );
        })}
        <div className="dot-line"></div>
        <p className="alpha-to-omega">Steinzeit</p>
      </div>
      {playerCount > 1 && (
        <>
          <div id="middle-line"></div>
          <div className="timeline-side">
            <p className="alpha-to-omega">Neuzeit</p>
            <div className="dot-line"></div>
            {ereignisArrays.playerTwo.map((value, index) => {
              // FALL 1: Leerer Slot → Plus-Button
              if (value === -1) {
                return (
                  <button
                    key={index}
                    className="timeline-add-btn"
                    onClick={() => handleAddClick("playerTwo", index)}
                  >
                    +
                  </button>
                );
              }

              // FALL 2: Zahl → Ereignis anzeigen
              const event = WannWarEsData[value];

              return (
                <>
                  <div className="solid-line"></div>
                  <div key={index} className="timeline-event">
                    <h4>{event.caption}</h4>
                    <p className="event-date">{event.date}</p>
                  </div>
                  <div className="solid-line"></div>
                </>
              );
            })}
            <div className="dot-line"></div>
            <p className="alpha-to-omega">Steinzeit</p>
          </div>
        </>
      )}
    </section>
  );
}
