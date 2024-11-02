"use client";

import { positions, TeamPosition } from "@/app/positions-regular-zone";
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

export const SimulateReducido = () => {
  const firstRoundMatches = calculateMatchesFirstRound();

  const [roundMatches, setRoundMatches] = useState(firstRoundMatches);
  const [finalWinner, setFinalWinner] = useState<TeamPosition | null>();
  const [secondPromotion, setSecondPromotion] = useState<TeamPosition | null>();

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
            setRoundMatches(firstRoundMatches);
            setFinalWinner(null);
            setSecondPromotion(null);
          }}
        >
          Volver a simular
        </Button>
      </div>
    );
  }

  return (
    <RoundForm
      roundName={roundName}
      matches={roundMatches}
      firstPositionFinal={isFirstRound ? final : undefined}
      onSubmit={(teamsWhoClassify) => {
        if (isFirstRound) {
          const teamWhoPlayFinalAndLoose = teamsWhoClassify.find(
            (team) => team === final.home.team || team === final.away.team
          );
          const winnerOfFinal =
            final.home.team === teamWhoPlayFinalAndLoose
              ? final.away
              : final.home;
          setFinalWinner(winnerOfFinal);
        }

        const isFinal = roundMatches.length === 1;

        if (isFinal) {
          const secondPromotionTeam = [
            ...positions.zoneA,
            ...positions.zoneB,
          ].find(({ team }) => teamsWhoClassify.includes(team))!;
          setSecondPromotion(secondPromotionTeam);
        }

        const nextRoundMatches: typeof firstRoundMatches = [];
        const classifiedTeamsPositions = teamsWhoClassify
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

              return ptsA < ptsB ? 1 : -1;
            }

            return a.position < b.position ? 1 : -1;
          });

        for (let i = 0; i < teamsWhoClassify.length; i += 2) {
          const teamA = classifiedTeamsPositions[i];
          const teamB =
            classifiedTeamsPositions[classifiedTeamsPositions.length - 1 - i];

          const middle = Math.floor(teamsWhoClassify.length / 2);
          const home = i > middle ? teamA : teamB;
          const away = i > middle ? teamB : teamA;

          nextRoundMatches.push({ home, away });
        }

        setRoundMatches(nextRoundMatches);
      }}
    />
  );
};
