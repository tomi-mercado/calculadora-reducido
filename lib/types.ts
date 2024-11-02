import { TeamPosition } from "@/app/positions-regular-zone";
import { z } from "zod";

export const resultSchema = z.enum(["home", "away", "draw"]);
export type Result = z.infer<typeof resultSchema>;

export type PlayedMatchResult = {
  home: TeamPosition;
  away: TeamPosition;
  result: Result;
  classified: "home" | "away";
};

type NotPlayedMatchResult = {
  home: TeamPosition;
  away: TeamPosition;
  result: null;
  classified: null;
};

export type MatchResult = PlayedMatchResult | NotPlayedMatchResult;

export type Round = MatchResult[];

export type PlayedRound = PlayedMatchResult[];
