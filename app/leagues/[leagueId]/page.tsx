export default function LeaguePage({
  params,
}: {
  params: { leagueId: string };
}) {
  return (
    <div>
      리그 ID: {params.leagueId}
    </div>
  );
}
