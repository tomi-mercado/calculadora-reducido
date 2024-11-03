import {
  positions,
  TeamName,
  TeamPosition,
} from "@/app/positions-regular-zone";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MatchResult, Round } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PROMIEDOS_URL = "https://www.promiedos.com.ar";
export const getImageURL = (imageSrc: string) => {
  return `${PROMIEDOS_URL}/${imageSrc}`;
};

export const findTeam = (team: TeamName | (string & {})) => {
  const teamPosition = [...positions.zoneA, ...positions.zoneB].find(
    (teamPosition) => teamPosition.team === team
  );

  if (!teamPosition) {
    throw new Error(`${team} not found`);
  }

  return teamPosition;
};

export const defineVentajaDeportiva = (
  teamA: TeamPosition,
  teamB: TeamPosition
) => {
  const haveSamePosition = teamA.position === teamB.position;

  if (haveSamePosition) {
    return teamA.pts > teamB.pts ? teamA : teamB;
  }

  return teamA.position < teamB.position ? teamA : teamB;
};

export const getNextRound = (round: Round): Round => {
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

    nextRoundMatches.push({
      home,
      away,
      classified: null,
      result: null,
      isResultFromReality: false,
    });
  }

  return nextRoundMatches;
};

const REDUCIDO_RESULTS: MatchResult[] = [
  {
    home: findTeam("Quilmes"),
    away: findTeam("Def. de Belgrano"),
    classified: "home",
    result: "home",
    isResultFromReality: true,
  },
  {
    home: findTeam("Gimnasia (M)"),
    away: findTeam("Estudiantes (BA)"),
    classified: "home",
    result: "draw",
    isResultFromReality: true,
  },
  {
    home: findTeam("San Telmo"),
    away: findTeam("Gimnasia (J)"),
    classified: "home",
    result: "home",
    isResultFromReality: true,
  },
];

export const replaceWithRealResults = (
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
    return replaceWithRealResults(getNextRound(roundWithReality as Round), [
      ...skippedRoundsUntilNow,
      roundWithReality,
    ]);
  }

  return {
    round: roundWithReality,
    skippedRounds: skippedRoundsUntilNow,
  };
};
