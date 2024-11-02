"use client";

import { TeamPosition } from "@/app/positions-regular-zone";
import { Trophy } from "lucide-react";
import { useFormState } from "react-dom";
import { z } from "zod";
import { InputMatchPrediction } from "./input-match-prediction";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type State =
  | { type: "idle" }
  | { type: "error"; error: string }
  | { type: "success"; teamsWhoClassify: string[] };

const handleSubmit = (_: State, formData: FormData): State => {
  const entries = formData.entries();
  const data = Array.from(entries).reduce((acc, [key, value]) => {
    return { ...acc, [key]: value };
  }, {});

  const matchResults: {
    home: string;
    away: string;
    result: "home" | "away" | "draw";
  }[] = [];

  for (const key in data) {
    if (key.endsWith("-loser-pass")) {
      continue;
    }

    const [home, away] = key.split("-");
    const resultToCheck = data[key as keyof typeof data];
    const resultParse = z
      .enum(["home", "away", "draw"])
      .safeParse(resultToCheck);

    if (!resultParse.success) {
      return {
        type: "error" as const,
        error: `Debes indicar un resultado válido para ${home}-${away}`,
      };
    }

    const result = resultParse.data;

    matchResults.push({ home, away, result });
  }

  const teamsWhoClassify: string[] = [];

  for (const match of matchResults) {
    const loserPassToNextRound =
      data[`${match.home}-${match.away}-loser-pass` as keyof typeof data] ===
      "true";

    if (loserPassToNextRound) {
      if (match.result === "home") {
        teamsWhoClassify.push(match.away);
        continue;
      }

      if (match.result === "away") {
        teamsWhoClassify.push(match.home);
        continue;
      }

      return {
        type: "error" as const,
        error: `Invalid value for ${match.home}-${match.away}. Loser can't pass to next round if it's a draw`,
      };
    }

    if (match.result === "home" || match.result === "draw") {
      teamsWhoClassify.push(match.home);
      continue;
    }

    if (match.result === "away") {
      teamsWhoClassify.push(match.away);
      continue;
    }
  }

  return { type: "success" as const, teamsWhoClassify };
};

export const RoundForm = ({
  matches,
  roundName,
  firstPositionFinal,
  onSubmit,
}: {
  roundName: string;
  matches: { home: TeamPosition; away: TeamPosition }[];
  children?: React.ReactNode;
  firstPositionFinal?: { home: TeamPosition; away: TeamPosition };
  onSubmit: (teamsWhoClassify: string[]) => void;
}) => {
  const [state, action] = useFormState(
    (prevState: State, formData: FormData) => {
      const retVal = handleSubmit(prevState, formData);

      if (retVal.type === "success") {
        onSubmit(retVal.teamsWhoClassify);
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl justify-center">
              <Trophy className="h-6 w-6 text-primary" />
              Final
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InputMatchPrediction
              loserPassToNextRound
              home={firstPositionFinal.home}
              away={firstPositionFinal.away}
            />
          </CardContent>
        </Card>
      )}

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

      {errorToShow && <p className="text-red-500">{errorToShow}</p>}

      <Button>Next round</Button>
    </form>
  );
};
