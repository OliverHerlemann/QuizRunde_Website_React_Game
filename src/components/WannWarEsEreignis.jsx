import { WannWarEsData } from "../WannWarEsData.jsx";
import { useEffect, useState } from "react";

export default function WannWarEsEreignis({
  ereignis,
  setEreignis,
  activePlayer,
  ereignisArrays,
  ereignisTrigger
}) {
  function isEreignisBereitsVerwendet(index) {
    return (
      ereignisArrays.playerOne.includes(index) ||
      ereignisArrays.playerTwo.includes(index)
    );
  }

    useEffect(() => {
      let zufallsIndex;
      let safety = 0;
    
      do {
        zufallsIndex = Math.floor(Math.random() * WannWarEsData.length);
        safety++;
      } while (
        (ereignisArrays.playerOne.includes(zufallsIndex) ||
         ereignisArrays.playerTwo.includes(zufallsIndex)) &&
        safety < 200
      );
    
      if (safety >= 200) {
        setEreignis(null);
        return;
      }
    
      setEreignis(WannWarEsData[zufallsIndex]);
    }, [ereignisTrigger]);

  if (!ereignis) return null;

  return (
    <section>
      <div className="Zufall-H-Ereignis">
        <h3>{ereignis.title}</h3>
        <p>{ereignis.description}</p>
      </div>
    </section>
  );
}
