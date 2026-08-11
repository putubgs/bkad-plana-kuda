import RatingView from "@/components/rating/rating-view";

export default async function RatingTicketPage({
  params,
}: {
  params: Promise<{ noTiket: string }>;
}) {
  const { noTiket } = await params;
  return <RatingView noTiket={decodeURIComponent(noTiket)} />;
}
