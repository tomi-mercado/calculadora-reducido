"use client";

import { TeamPosition } from "@/app/positions-regular-zone";
import { z } from "zod";
import { InputMatchPrediction } from "./input-match-prediction";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const handleSubmit = (formData: FormData) => {
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
        error: `Invalid value for ${key}`,
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

  console.log(teamsWhoClassify);
};

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
    <form
      className="flex flex-col gap-6"
      // @ts-expect-error me pudrí de pelear con las versiones de ts
      action={handleSubmit}
    >
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
