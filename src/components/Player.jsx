export default function Player({ playerColor, player }) {
  return (
    <div className={`${playerColor} ${player.isTimeToAnswer ? "active" : ""}`}>
      <p>{player.name}</p>
      <p>Punkte: {player.points}</p>
    </div>
  );
}
