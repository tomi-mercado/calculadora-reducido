"use client";

import { TeamPosition } from "@/app/positions-regular-zone";
import { Result } from "@/lib/types";
import { cn, getImageURL } from "@/lib/utils";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "./ui/button";

export const InputMatchPrediction = ({
  home,
  away,
  allowDraw,
  loserPassToNextRound,
  defaultValue: _defaultValue,
}: {
  home: TeamPosition;
  away: TeamPosition;
  allowDraw?: boolean;
  loserPassToNextRound?: boolean;
  defaultValue?: Result | null;
}) => {
  const defaultValue = _defaultValue || (allowDraw ? "draw" : null);
  const [result, setResult] = useState<Result | null>(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (winner: Result) => {
    setResult(winner);
    if (inputRef.current) {
      inputRef.current.value = winner;
    }
  };

  const name = `${home.team}-${away.team}`;

  return (
    <div className="grid grid-cols-[1fr,126px,1fr] gap-4 py-2 px-4 bg-accent rounded-lg">
      <div className="inline-flex mt-[5px] xs:mt-0 xs:items-center whitespace-nowrap text-left gap-2">
        <Image
          src={getImageURL(home.imageSrc)}
          width={24}
          height={24}
          className="shrink-0 size-6"
          alt={home.team}
        />
        <span className="hidden xs:block">{home.team}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-center">
          <Button
            variant="secondary"
            size="icon"
            type="button"
            className={cn(
              "hover:bg-green-800/60 border border-white/10",
              result === "home" && "bg-green-800",
              result === "away" && "bg-red-800"
            )}
            onClick={() => handleChange("home")}
          />
          {allowDraw && (
            <Button
              variant="secondary"
              size="icon"
              type="button"
              className={cn(
                "hover:bg-yellow-400/60 border border-white/10",
                result === "draw" && "bg-yellow-400 text-black"
              )}
              onClick={() => handleChange("draw")}
            />
          )}
          <Button
            variant="secondary"
            size="icon"
            onClick={() => handleChange("away")}
            type="button"
            className={cn(
              "hover:bg-green-800/60 border border-white/10",
              result === "away" && "bg-green-800",
              result === "home" && "bg-red-800"
            )}
          />
        </div>
        <div className="xs:hidden text-center">
          <p>{home.team}</p>
          <p>VS</p>
          <p>{away.team}</p>
        </div>
      </div>
      <div className="inline-flex xs:items-center gap-2 mt-[5px] xs:mt-0 whitespace-nowrap text-right justify-end">
        <span className="hidden xs:block">{away.team}</span>

        <Image
          src={getImageURL(away.imageSrc)}
          width={24}
          height={24}
          className="shrink-0 size-6"
          alt={away.team}
        />
      </div>

      <input
        hidden
        readOnly
        name={name}
        ref={inputRef}
        required={!allowDraw}
        defaultValue={defaultValue ?? ""}
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
