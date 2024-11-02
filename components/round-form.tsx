import { TeamPosition } from "@/app/positions-regular-zone";
import { InputMatchPrediction } from "./input-match-prediction";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const RoundForm = ({
  matches,
  roundName,
  children,
}: {
  roundName: string;
  matches: { home: TeamPosition; away: TeamPosition }[];
  children?: React.ReactNode;
}) => {
  return (
    <form className="flex flex-col gap-6">
      {children}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">{roundName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {matches.map((match, index) => (
            <InputMatchPrediction
              key={index}
              home={match.home}
              away={match.away}
              allowDraw
            />
          ))}
        </CardContent>
      </Card>

      <Button>Next round</Button>
    </form>
  );
};
