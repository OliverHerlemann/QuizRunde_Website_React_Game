import { useEffect } from "react";
import { WannWarEsData } from "../WannWarEsData.jsx";

export default function WannWarEsTimeline({
  playerCount,
  ereignis,
  ereignisArrays,
  setEreignisArrays,
}) {
  /* useEffect(() => {
        setEreignisArrays();
      }, [ereignis]); */

  return (
    <section className="timeline-container">
      <div className="timeline-side">
        <p className="alpha-to-omega">Neuzeit</p>
        <div className="dot-line"></div>
        {ereignisArrays.playerOne.map((value, index) => {
          // FALL 1: Leerer Slot → Plus-Button
          if (value === 0) {
            return (
              <button
                key={index}
                className="timeline-add-btn"
                onClick={() => {
                  // hier später Logik zum Einfügen
                  console.log("Plus geklickt an Stelle", index);
                }}
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
              if (value === 0) {
                return (
                  <button
                    key={index}
                    className="timeline-add-btn"
                    onClick={() => {
                      // hier später Logik zum Einfügen
                      console.log("Plus geklickt an Stelle", index);
                    }}
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
