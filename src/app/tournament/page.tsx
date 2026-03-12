import { getAllTournaments } from '@/backend/actions';
import TournamentList from '@/components/TournamentList';

export default async function TournamentsListPage() {
  const tournaments = await getAllTournaments();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="w-full max-w-md mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Tournaments</h1>
          <p className="text-sm text-slate-500 mt-1">Select a tournament to view or vote</p>
        </div>
        <TournamentList tournaments={tournaments} />
      </div>
    </main>
  );
}
