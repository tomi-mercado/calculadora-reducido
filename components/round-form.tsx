import { TeamPosition } from "@/app/positions-regular-zone";
import { InputMatchPrediction } from "./input-match-prediction";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const RoundForm = ({
  matches,
  roundName,
}: {
  roundName: string;
  matches: { home: TeamPosition; away: TeamPosition }[];
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{roundName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {matches.map((match, index) => (
          <InputMatchPrediction
            key={index}
            home={match.home}
            away={match.away}
          />
        ))}
      </CardContent>
    </Card>
  );
};
