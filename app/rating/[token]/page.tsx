import RatingView from "@/components/rating/rating-view";
import { notFound } from "next/navigation";

export default async function RatingTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const decoded = decodeURIComponent(token).trim();
  if (!decoded) {
    notFound();
  }
  return <RatingView token={decoded} />;
}
