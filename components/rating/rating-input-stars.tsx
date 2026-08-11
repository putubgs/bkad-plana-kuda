"use client";

import { useState } from "react";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";

export default function RatingInputStars({
  value,
  onChange,
  size = 32,
}: {
  value: number;
  onChange: (value: number) => void;
  size?: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          aria-label={`Beri rating ${star} bintang`}
          className="text-amber-400 transition-transform hover:scale-110"
        >
          {star <= display ? (
            <StarRoundedIcon sx={{ fontSize: size }} />
          ) : (
            <StarBorderRoundedIcon sx={{ fontSize: size }} />
          )}
        </button>
      ))}
    </div>
  );
}
