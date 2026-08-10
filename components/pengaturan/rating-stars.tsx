import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarHalfRoundedIcon from "@mui/icons-material/StarHalfRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";

export default function RatingStars({
  rating,
  size = 14,
}: {
  rating: number;
  size?: number;
}) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const empty = Math.max(0, 5 - full - (hasHalf ? 1 : 0));

  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: full }).map((_, index) => (
        <StarRoundedIcon key={`full-${index}`} sx={{ fontSize: size }} />
      ))}
      {hasHalf ? <StarHalfRoundedIcon sx={{ fontSize: size }} /> : null}
      {Array.from({ length: empty }).map((_, index) => (
        <StarBorderRoundedIcon key={`empty-${index}`} sx={{ fontSize: size }} />
      ))}
    </span>
  );
}
