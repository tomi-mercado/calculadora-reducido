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

const firstRoundMatches = [
  {
    ...final,
    result: null,
    classified: null,
  },
  ...calculateMatchesFirstRound(),
];

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

const getFinalResult = (firstRound: Round) => {
  const finalResult = firstRound.find(
    (result) =>
      result.home.team === final.home.team &&
      result.away.team === final.away.team
  );

  if (!finalResult) {
    return null;
  }

  return finalResult;
};

const getFinalWinner = (firstRound: Round) => {
  const finalResult = getFinalResult(firstRound);

  if (!finalResult) {
    return null;
  }

  if (!finalResult.result) {
    return null;
  }

  const finalWinner = finalResult.result === "home" ? final.home : final.away;

  return finalWinner;
};

const getSecondPromotion = (currentRound: Round) => {
  const haveChampionOfReducido =
    currentRound.length === 1 &&
    currentRound[0].home.team === currentRound[0].away.team;

  if (haveChampionOfReducido) {
    return currentRound[0].home;
  }

  return null;
};

export const SimulateReducido = () => {
  const [rounds, setRounds] = useState<Round[]>([
    firstRoundMatches.map((match) => ({
      ...match,
      result: null,
      classified: null,
    })),
  ]);

  const [currentRound, setCurrentRound] = useState(0);

  const roundMatches = rounds[currentRound];
  const finalWinner = getFinalWinner(rounds[0]);
  const secondPromotion = getSecondPromotion(roundMatches);

  const isFirstRound = roundMatches.length === firstRoundMatches.length;

  const roundName = {
    [8]: "Octavos de final",
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
            setCurrentRound((prev) => prev - 1);
          }}
        >
          <ChevronLeft size={24} className="mr-2" />
          Ronda anterior
        </Button>
      )}
      <RoundForm
        roundName={roundName}
        matches={roundMatches.slice(isFirstRound ? 1 : 0)}
        firstPositionFinal={
          isFirstRound ? getFinalResult(rounds[0]) : undefined
        }
        onSubmit={(roundResults) => {
          setRounds((prev) => {
            const copy = [...prev];
            copy[currentRound] = roundResults;
            const nextRound = getNextRound(roundResults);
            return [...copy.slice(0, currentRound + 1), nextRound];
          });
          setCurrentRound((prev) => prev + 1);
        }}
      />
    </div>
  );
};
