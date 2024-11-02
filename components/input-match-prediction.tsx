"use client";

import { TeamPosition } from "@/app/positions-regular-zone";
import { cn, getImageURL } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";

export const InputMatchPrediction = ({
  home,
  away,
}: {
  home: TeamPosition;
  away: TeamPosition;
}) => {
  const [winner, setWinner] = useState<"home" | "away" | null>(null);

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
          className={cn(
            "hover:bg-green-800/60",
            winner === "home" && "bg-green-800",
            winner === "away" && "bg-red-800"
          )}
          onClick={() => setWinner("home")}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setWinner("away")}
          className={cn(
            "hover:bg-green-800/60",
            winner === "away" && "bg-green-800",
            winner === "home" && "bg-red-800"
          )}
        />
      </div>
      <div className="inline-flex items-center gap-2 whitespace-nowrap text-right">
        {away.team}

        <Image
          src={getImageURL(away.imageSrc)}
          width={24}
          height={24}
          alt={away.team}
        />
      </div>
    </div>
  );
};
