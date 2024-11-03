import { REDUCIDO_RESULTS } from "@/app/reducido-results";
import { SimulateReducido } from "@/components/simulate-reducido";
import { PlayedRound, Round } from "@/lib/types";
import { getNextRound } from "@/lib/utils";
import { firstRoundMatches } from "./first-round-data";

const replaceWithRealResults = (
  round: Round,
  skippedRoundsUntilNow: Round[] = []
): {
  round: Round;
  skippedRounds: Round[];
} => {
  const roundWithReality = round.map((match) => {
    const { home, away } = match;

    const resultInReality = REDUCIDO_RESULTS.find(
      (result) =>
        result.home.team === home.team && result.away.team === away.team
    );

    return resultInReality ?? match;
  });

  const allIsReality = roundWithReality.every(
    (match) => match.isResultFromReality
  );

  if (allIsReality) {
    return replaceWithRealResults(
      getNextRound(roundWithReality as PlayedRound),
      [...skippedRoundsUntilNow, roundWithReality]
    );
  }

  return {
    round: roundWithReality,
    skippedRounds: skippedRoundsUntilNow,
  };
};

const { round, skippedRounds } = replaceWithRealResults(
  firstRoundMatches.map((match) => ({
    ...match,
    result: null,
    classified: null,
    isResultFromReality: false as const,
  }))
);

const initialRound = [
  round[0],
  ...round.slice(1).sort((a) => (a.isResultFromReality ? 1 : -1)),
];

const initialStateRounds = [...skippedRounds, initialRound];

export default function Home() {
  return (
    <SimulateReducido
      initialStateRounds={initialStateRounds}
      skippedRounds={skippedRounds}
    />
  );
}
