"use client";

import { positions } from "@/app/positions-regular-zone";
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

const getRoundMatches = (teamsWhoClassifyHistory: string[][]) => {
  const teamWhoPlayFinalAndLoose = teamsWhoClassifyHistory[0]?.find(
    (team) => team === final.home.team || team === final.away.team
  );

  const winnerOfFinal =
    final.home.team === teamWhoPlayFinalAndLoose ? final.away : final.home;

  const lastInHistory = teamsWhoClassifyHistory.at(-1);

  if (!lastInHistory) {
    return {
      nextRoundMatches: firstRoundMatches,
      finalWinner: winnerOfFinal,
      secondPromotion: null,
    };
  }

  const isFinal = lastInHistory.length === 1;
  const secondPromotionTeam = isFinal
    ? [...positions.zoneA, ...positions.zoneB].find(({ team }) =>
        lastInHistory[0].includes(team)
      )!
    : null;

  const classifiedTeamsPositions = lastInHistory
    .map(
      (_team) =>
        [...positions.zoneA, ...positions.zoneB].find(
          ({ team }) => _team === team
        )!
    )
    .sort((a, b) => {
      if (a.position === b.position) {
        const ptsA = a.pts;
        const ptsB = b.pts;

        return ptsA > ptsB ? 1 : -1;
      }

      return a.position < b.position ? 1 : -1;
    });
  const nextRoundMatches: typeof firstRoundMatches = [];

  for (let i = 0; i < lastInHistory.length; i += 2) {
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

    nextRoundMatches.push({ home, away });
  }

  console.log({ winnerOfFinal });

  return {
    nextRoundMatches,
    finalWinner: winnerOfFinal,
    secondPromotion: secondPromotionTeam,
  };
};

export const SimulateReducido = () => {
  const [teamsWhoClassifyHistory, setTeamsWhoClassifyHistory] = useState<
    string[][]
  >([]);
  const {
    finalWinner,
    nextRoundMatches: roundMatches,
    secondPromotion,
  } = getRoundMatches(teamsWhoClassifyHistory);

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
            setTeamsWhoClassifyHistory([]);
          }}
        >
          Volver a simular
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {!!teamsWhoClassifyHistory.length && (
        <Button
          variant="ghost"
          className="w-fit"
          onClick={() => {
            setTeamsWhoClassifyHistory((prev) => prev.slice(0, -1));
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
        onSubmit={(teamsWhoClassify) => {
          setTeamsWhoClassifyHistory((prev) => [...prev, teamsWhoClassify]);
        }}
      />
    </div>
  );
};
