import { PlayedMatchResult } from "@/lib/types";
import { findTeam } from "@/lib/utils";

export const REDUCIDO_RESULTS: PlayedMatchResult[] = [
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
