"use client";

import { TeamPosition } from "@/app/positions-regular-zone";
import { getImageURL } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUp, Sparkles, Trophy } from "lucide-react";
import Image from "next/image";

export function PromotionAnnouncement({
  promotions,
}: {
  promotions: [TeamPosition, TeamPosition];
}) {
  return (
    <div className="bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4 rounded-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto text-center"
      >
        <div className="space-y-8">
          {/* Trophy Icon */}
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Trophy className="h-20 w-20 mx-auto text-primary" />
          </motion.div>

          {/* Team Logos */}
          <div className="flex items-center justify-center gap-6 sm:gap-12">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary/10 flex items-center justify-center">
                <Image
                  src={getImageURL(promotions[0].imageSrc)}
                  alt={promotions[0].team}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                  width={80}
                  height={80}
                />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 }}
                className="absolute -top-2 -right-2"
              >
                <ArrowUp className="w-6 h-6 text-primary" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary/10 flex items-center justify-center">
                <Image
                  src={getImageURL(promotions[1].imageSrc)}
                  alt={promotions[1].team}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                  width={80}
                  height={80}
                />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 }}
                className="absolute -top-2 -right-2"
              >
                <ArrowUp className="w-6 h-6 text-primary" />
              </motion.div>
            </motion.div>
          </div>

          {/* Announcement Text */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              ¡Ascenso!
            </h1>
            <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-muted-foreground">
              {promotions[0].team} y {promotions[1].team}
            </p>
            <div className="relative inline-block">
              <p className="text-xl sm:text-2xl font-medium text-primary">
                ascienden a la Primera División
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -right-8 -top-8"
              >
                <Sparkles className="w-6 h-6 text-primary" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute -left-8 -bottom-8"
              >
                <Sparkles className="w-6 h-6 text-primary" />
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="pt-8"
          >
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
