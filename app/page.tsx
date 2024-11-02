import { RoundForm } from "@/components/round-form";
import { positions } from "./positions-regular-zone";

const calculateMatchesFirstRound = () => {
  const { zoneA, zoneB } = positions;
  const zoneAWithoutFirst = zoneA.slice(1);
  const zoneBWithoutFirst = zoneB.slice(1);

  return zoneAWithoutFirst.map((team, index) => {
    const teamA = { ...team };
    const teamB = {
      ...zoneBWithoutFirst[zoneBWithoutFirst.length - 1 - index],
    };

    const haveSamePosition = teamA.position === teamB.position;

    if (haveSamePosition) {
      const localTeam = teamA.pts > teamB.pts ? teamA : teamB;
      const visitorTeam = teamA.pts > teamB.pts ? teamB : teamA;

      return {
        home: localTeam,
        away: visitorTeam,
      };
    }

    const localTeam = teamA.position < teamB.position ? teamA : teamB;
    const visitorTeam = teamA.position < teamB.position ? teamB : teamA;

    return {
      home: localTeam,
      away: visitorTeam,
    };
  });
};

export default function Home() {
  const firstRoundMatches = calculateMatchesFirstRound();

  return (
    <div className="mx-auto max-w-3xl py-6">
      <RoundForm
        roundName="Octavos de final"
        matches={firstRoundMatches}
        firstPositionFinal={{
          home: positions.zoneA[0],
          away: positions.zoneB[0],
        }}
      />
    </div>
  );
}
