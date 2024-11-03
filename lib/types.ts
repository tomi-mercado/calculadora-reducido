import { TeamPosition } from "@/app/positions-regular-zone";
import { z } from "zod";

export const resultSchema = z.enum(["home", "away", "draw"]);
export type Result = z.infer<typeof resultSchema>;

// const matchResultSchema

export type MatchResult = {
  home: TeamPosition;
  away: TeamPosition;
  result: Result | null;
  classified: "home" | "away" | null;
  isResultFromReality: boolean;
};

export type Round = MatchResult[];
