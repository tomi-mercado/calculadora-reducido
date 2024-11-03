"use client";

import { final, firstRoundMatches } from "@/app/first-round-data";
import { Round } from "@/lib/types";
import { getNextRound } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { PromotionAnnouncement } from "./promotion-announcement";
import { RoundForm } from "./round-form";
import { Button } from "./ui/button";

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

export const SimulateReducido = ({
  initialStateRounds,
  skippedRounds,
}: {
  initialStateRounds: Round[];
  skippedRounds: Round[];
}) => {
  const [rounds, setRounds] = useState<Round[]>(initialStateRounds);

  const [currentRound, setCurrentRound] = useState(skippedRounds.length);

  const roundMatches = rounds[currentRound];
  const finalWinner = getFinalWinner(rounds[0]);
  const secondPromotion = getSecondPromotion(roundMatches);

  const isFirstRound = roundMatches.length === firstRoundMatches.length;

  const everythingWasReality = rounds.every((round) =>
    round.every(
      (match) =>
        match.isResultFromReality || match.home.team === match.away.team
    )
  );

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
        {!everythingWasReality && (
          <Button
            onClick={() => {
              setRounds(initialStateRounds);
              setCurrentRound(skippedRounds.length);
            }}
          >
            Volver a simular
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {currentRound > 0 && (
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
