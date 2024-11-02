import { z } from "zod";

export const resultSchema = z.enum(["home", "away", "draw"]);
export type Result = z.infer<typeof resultSchema>;
