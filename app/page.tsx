import { positions } from "./positions-regular-zone";

const calculateMatchesFirstRound = () => {
  const { zoneA, zoneB } = positions;
  const zoneAWithoutFirst = zoneA.slice(1);
  const zoneBWithoutFirst = zoneB.slice(1);

  return zoneAWithoutFirst.map((team, index) => {
    const match = {
      home: team,
      away: zoneB[zoneBWithoutFirst.length - index],
    };

    return match;
  });
};

export default function Home() {
  const firstRoundMatches = calculateMatchesFirstRound();
  const finalists = [positions.zoneA[0], positions.zoneB[0]];

  return (
    <div className="flex flex-col gap-6 items-center text-center py-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-xl">Final del primer puesto</h3>
        <p>
          {finalists[0].team} vs {finalists[1].team}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-xl">Octavos de final</h3>
        <ul className="flex flex-col gap-1">
          {firstRoundMatches.map((match, index) => (
            <li key={index}>
              {match.home.team} vs {match.away.team}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
