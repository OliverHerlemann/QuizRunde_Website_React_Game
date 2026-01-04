import { WannWarEsData } from "../WannWarEsData.jsx";
import { useEffect, useState } from "react";

export default function WannWarEsEreignis({ereignis, setEreignis}) {





    useEffect(() => {
        const zufallsIndex = Math.floor(Math.random() * WannWarEsData.length);
        setEreignis(WannWarEsData[zufallsIndex]);
      }, []); // 👈 läuft nur einmal beim Mount

      if (!ereignis) return null; 

    return <section>
        <div className="Zufall-H-Ereignis">
            <h3>{ereignis.title}</h3>
            <p>{ereignis.description}</p>
        </div>
    </section>;
}