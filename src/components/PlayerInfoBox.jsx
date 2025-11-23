import Player from "./Player.jsx";
import { useState } from "react";

export default function PlayerInfoBox({ playerOne, playerTwo, playerCount }) {
  return (
    <>
      <Player playerColor="orange" player={playerOne} />
      {playerCount >= 2 && <Player playerColor="blue" player={playerTwo} />}
    </>
  );
}
