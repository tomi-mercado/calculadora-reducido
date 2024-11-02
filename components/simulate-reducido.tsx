"use client";

import { positions } from "@/app/positions-regular-zone";
import { PlayedRound, Round } from "@/lib/types";
import { defineVentajaDeportiva } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { PromotionAnnouncement } from "./promotion-announcement";
import { RoundForm } from "./round-form";
import { Button } from "./ui/button";

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

const final = {
  home: positions.zoneA[0],
  away: positions.zoneB[0],
};

const firstRoundMatches = calculateMatchesFirstRound();

const getNextRound = (round: PlayedRound): Round => {
  const classifiedTeamsPositions = round
    .map((result) => (result.classified === "home" ? result.home : result.away))
    .sort((a, b) => {
      const betterVentajaDeportiva = defineVentajaDeportiva(a, b);
      return a.team === betterVentajaDeportiva.team ? 1 : -1;
    });

  const nextRoundMatches: Round = [];

  for (let i = 0; i < round.length; i += 2) {
    const teamA = classifiedTeamsPositions[i];
    const teamB =
      classifiedTeamsPositions[classifiedTeamsPositions.length - 1 - i];

    const home =
      classifiedTeamsPositions.indexOf(teamA) >
      classifiedTeamsPositions.indexOf(teamB)
        ? teamA
        : teamB;
    const away =
      classifiedTeamsPositions.indexOf(teamA) >
      classifiedTeamsPositions.indexOf(teamB)
        ? teamB
        : teamA;

    nextRoundMatches.push({ home, away, classified: null, result: null });
  }

  return nextRoundMatches;
};

const getFinalWinner = (matchResultsHistory: Round[]) => {
  if (matchResultsHistory.length === 0) {
    return null;
  }

  validateIfRoundIsPlayed(matchResultsHistory[0]);

  const finalResult = matchResultsHistory[0].find(
    (result) =>
      result.home.team === final.home.team &&
      result.away.team === final.away.team
  );

  if (!finalResult) {
    throw new Error("Final result not found");
  }

  const finalWinner = finalResult.result === "home" ? final.home : final.away;

  return finalWinner;
};

const getSecondPromotion = (matchResultsHistory: Round[]) => {
  if (matchResultsHistory.length === 0) {
    return null;
  }

  validateIfRoundIsPlayed(matchResultsHistory.at(-1)!);

  const lastRound = matchResultsHistory.at(-1)!;

  const isFinal = lastRound.length === 1;

  if (!isFinal) {
    return null;
  }

  const finalResult = lastRound[0];
  return finalResult.classified === "home"
    ? finalResult.home
    : finalResult.away;
};

const validateIfRoundIsPlayed = (round: Round) => {
  const areMissingResults = round.some(
    (result) => result.result === null || result.classified === null
  );

  if (areMissingResults) {
    throw new Error("Missing results");
  }

  return round as PlayedRound;
};

const getRoundMatches = (matchResultsHistory: Round[]) => {
  const lastResults = matchResultsHistory.at(-1);

  if (!lastResults) {
    return firstRoundMatches;
  }

  validateIfRoundIsPlayed(lastResults);

  // The cast is correct because I am checking not missing results
  const nextRoundMatches = getNextRound(lastResults as PlayedRound);

  return nextRoundMatches;
};

export const SimulateReducido = () => {
  const [rounds, setRounds] = useState<Round[]>([]);

  const roundMatches = getRoundMatches(rounds);
  const finalWinner = getFinalWinner(rounds);
  const secondPromotion = getSecondPromotion(rounds);

  const isFirstRound = roundMatches.length === firstRoundMatches.length;

  const roundName = {
    // Is 7 because we have to sum the Final. The loser of the final pass to 4tos de final, and the winner promotes to 1st division.
    [7]: "Octavos de final",
    [4]: "Cuartos de final",
    [2]: "Semifinales",
    [1]: "Final",
  }[roundMatches.length]!;

  if (finalWinner && secondPromotion) {
    return (
      <div className="flex flex-col gap-6">
        <PromotionAnnouncement promotions={[finalWinner, secondPromotion]} />
        <Button
          onClick={() => {
            setRounds([]);
          }}
        >
          Volver a simular
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {!!rounds.length && (
        <Button
          variant="ghost"
          className="w-fit"
          onClick={() => {
            setRounds((prev) => prev.slice(0, -1));
          }}
        >
          <ChevronLeft size={24} className="mr-2" />
          Ronda anterior
        </Button>
      )}
      <RoundForm
        roundName={roundName}
        matches={roundMatches}
        firstPositionFinal={isFirstRound ? final : undefined}
        onSubmit={(roundResults) => {
          setRounds((prev) => [...prev, roundResults]);
        }}
      />
    </div>
  );
};
