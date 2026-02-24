import TournamentView from '@/components/TournamentView';
import { getTournamentPageData } from '@/backend/actions';

export default async function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { tournament, userVotes } = await getTournamentPageData(id);

  if (!tournament) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm">
          <h1 className="text-xl font-bold text-red-500 mb-2">Error Loading Tournament</h1>
          <p className="text-slate-500">Could not fetch tournament data for ID: {id}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 flex justify-center">
      <TournamentView tournament={tournament} initialSelections={userVotes} />
    </main>
  );
}
