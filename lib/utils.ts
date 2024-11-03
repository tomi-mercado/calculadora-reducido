import {
  positions,
  TeamName,
  TeamPosition,
} from "@/app/positions-regular-zone";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
