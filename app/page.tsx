import { InputMatchPrediction } from "@/components/input-match-prediction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
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
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl justify-center">
            <Trophy className="h-6 w-6 text-primary" />
            Final
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InputMatchPrediction home={finalists[0]} away={finalists[1]} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Octavos de final</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {firstRoundMatches.map((match, index) => (
            <InputMatchPrediction
              key={index}
              home={match.home}
              away={match.away}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
