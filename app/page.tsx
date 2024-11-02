import { InputMatchPrediction } from "@/components/input-match-prediction";
import { RoundForm } from "@/components/round-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
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
  const finalists = [positions.zoneA[0], positions.zoneB[0]];

  return (
    <div className="mx-auto max-w-3xl py-6">
      <RoundForm roundName="Octavos de final" matches={firstRoundMatches}>
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl justify-center">
              <Trophy className="h-6 w-6 text-primary" />
              Final
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InputMatchPrediction
              loserPassToNextRound
              home={finalists[0]}
              away={finalists[1]}
            />
          </CardContent>
        </Card>
      </RoundForm>
    </div>
  );
}
