import { SimulateReducido } from "@/components/simulate-reducido";
import { replaceWithRealResults } from "@/lib/utils";
import { firstRoundMatches } from "./first-round-data";

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
