"use client";

import { TeamPosition } from "@/app/positions-regular-zone";
import { cn, getImageURL } from "@/lib/utils";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "./ui/button";

export const InputMatchPrediction = ({
  home,
  away,
  allowDraw,
  loserPassToNextRound,
}: {
  home: TeamPosition;
  away: TeamPosition;
  allowDraw?: boolean;
  loserPassToNextRound?: boolean;
}) => {
  const [result, setResult] = useState<"home" | "away" | "draw" | null>(
    allowDraw ? "draw" : null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (winner: "home" | "away" | "draw") => {
    setResult(winner);
    if (inputRef.current) {
      inputRef.current.value = winner;
    }
  };

  const name = `${home.team}-${away.team}`;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="inline-flex items-center whitespace-nowrap text-left gap-2">
        <Image
          src={getImageURL(home.imageSrc)}
          width={24}
          height={24}
          alt={home.team}
        />
        {home.team}
      </div>
      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          size="icon"
          type="button"
          className={cn(
            "hover:bg-green-800/60",
            result === "home" && "bg-green-800",
            result === "away" && "bg-red-800"
          )}
          onClick={() => handleChange("home")}
        />
        {allowDraw && (
          <Button
            variant="outline"
            size="icon"
            type="button"
            className={cn(
              "hover:bg-yellow-400/60",
              result === "draw" && "bg-yellow-400"
            )}
            onClick={() => handleChange("draw")}
          />
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleChange("away")}
          type="button"
          className={cn(
            "hover:bg-green-800/60",
            result === "away" && "bg-green-800",
            result === "home" && "bg-red-800"
          )}
        />
      </div>
      <div className="inline-flex items-center gap-2 whitespace-nowrap text-right justify-end">
        {away.team}

        <Image
          src={getImageURL(away.imageSrc)}
          width={24}
          height={24}
          alt={away.team}
        />
      </div>

      <input
        hidden
        readOnly
        name={name}
        ref={inputRef}
        required={!allowDraw}
        defaultValue={allowDraw ? "draw" : ""}
      />
      <input
        hidden
        readOnly
        name={`${name}-loser-pass`}
        value={loserPassToNextRound ? "true" : "false"}
      />
    </div>
  );
};
