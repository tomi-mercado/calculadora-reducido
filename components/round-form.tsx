"use client";

import { FINAL_DESCRIPTION } from "@/lib/round-descriptions";
import {
  MatchResult,
  PlayedMatchResult,
  resultSchema,
  Round,
} from "@/lib/types";
import { cn, findTeam } from "@/lib/utils";
import { Trophy } from "lucide-react";
import { useFormState } from "react-dom";
import { InputMatchPrediction } from "./input-match-prediction";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

type State =
  | { type: "idle" }
  | { type: "error"; error: string }
  | { type: "success"; matchResults: PlayedMatchResult[] };

const handleSubmit = (_: State, formData: FormData): State => {
  const entries = formData.entries();
  const data = Array.from(entries).reduce((acc, [key, value]) => {
    return { ...acc, [key]: value };
  }, {});

  const matchResults: Omit<PlayedMatchResult, "classified">[] = [];
  const matchesInWhichPassLoser: string[] = [];

  for (const key in data) {
    if (key.endsWith("-loser-pass")) {
      if (data[key as keyof typeof data] !== "true") {
        continue;
      }

      const [homeTeam, awayTeam] = key.split("-").slice(0, 2);
      matchesInWhichPassLoser.push(`${homeTeam}-${awayTeam}`);
      continue;
    }

    const [homeTeam, awayTeam] = key.split("-");
    const resultToCheck = data[key as keyof typeof data];
    const resultParse = resultSchema.safeParse(resultToCheck);

    if (!resultParse.success) {
      return {
        type: "error" as const,
        error: `Debes indicar un resultado válido para ${homeTeam}-${awayTeam}`,
      };
    }

    const home = findTeam(homeTeam);
    const away = findTeam(awayTeam);
    const result = resultParse.data;

    matchResults.push({ home, away, result, isResultFromReality: false });
  }

  const matchResultsWithClassified: PlayedMatchResult[] = [];

  for (const match of matchResults) {
    const loserPassToNextRound = matchesInWhichPassLoser.includes(
      `${match.home.team}-${match.away.team}`
    );

    if (loserPassToNextRound) {
      if (match.result === "draw") {
        return {
          type: "error" as const,
          error: `Invalid value for ${match.home.team}-${match.away.team}. Loser can't pass to next round if it's a draw`,
        };
      }

      matchResultsWithClassified.push({
        home: match.home,
        away: match.away,
        result: match.result,
        classified: match.result === "home" ? "away" : "home",
        isResultFromReality: false,
      });

      continue;
    }

    matchResultsWithClassified.push({
      ...match,
      classified:
        match.result === "home" || match.result === "draw" ? "home" : "away",
    });
  }

  return {
    type: "success" as const,
    matchResults: matchResultsWithClassified,
  };
};

export const RoundForm = ({
  matches,
  roundName,
  roundDescription,
  firstPositionFinal,
  onSubmit,
}: {
  roundName: string;
  roundDescription: string;
  matches: Round;
  children?: React.ReactNode;
  firstPositionFinal?: MatchResult | null;
  onSubmit: (matchResults: PlayedMatchResult[]) => void;
}) => {
  const [state, action] = useFormState(
    (prevState: State, formData: FormData) => {
      const retVal = handleSubmit(prevState, formData);

      if (retVal.type === "success") {
        onSubmit(retVal.matchResults);
      }

      return retVal;
    },
    { type: "idle" }
  );
  const errorToShow = state.type === "error" ? state.error : null;

  return (
    <form className="flex flex-col gap-6" action={action}>
      {firstPositionFinal && (
        <Card className="border-primary">
          <CardHeader className="text-center items-center">
            <CardTitle className="flex items-center gap-2 text-2xl justify-center">
              <Trophy className="h-6 w-6 text-primary" />
              Final
            </CardTitle>
            <CardDescription className="w-2/3">
              {FINAL_DESCRIPTION}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InputMatchPrediction
              loserPassToNextRound
              home={firstPositionFinal.home}
              away={firstPositionFinal.away}
              defaultValue={firstPositionFinal.result}
              disabled={firstPositionFinal.isResultFromReality}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="text-center items-center">
          <CardTitle className="text-2xl">{roundName}</CardTitle>
          <CardDescription className="w-2/3">
            {roundDescription}
          </CardDescription>
        </CardHeader>
        <CardContent
          className={cn(
            "grid gap-4 grid-cols-1",
            matches.length > 2 ? "lg:grid-cols-2" : ""
          )}
        >
          {matches.map((match) => (
            <InputMatchPrediction
              key={`${match.home.team}-${match.away.team}`}
              home={match.home}
              away={match.away}
              allowDraw={matches.length !== 1}
              defaultValue={match.result}
              disabled={match.isResultFromReality}
            />
          ))}
        </CardContent>
      </Card>

      {errorToShow && <p className="text-red-500">{errorToShow}</p>}

      <Button>
        {matches.length === 1 ? "Ver ascensos" : "Siguiente ronda"}
      </Button>
    </form>
  );
};
