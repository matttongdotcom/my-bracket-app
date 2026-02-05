import TournamentView from '@/components/TournamentView';
import { getFullTournament } from '@/backend/actions';

export default async function TournamentPage() {
  const TOURNAMENT_ID = 'c6436508-082f-4fa4-ba46-6c7b5720ead1';
  const tournamentData = await getFullTournament(TOURNAMENT_ID);

  if (!tournamentData) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm">
          <h1 className="text-xl font-bold text-red-500 mb-2">Error Loading Tournament</h1>
          <p className="text-slate-500">Could not fetch tournament data for ID: {TOURNAMENT_ID}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 flex justify-center">
      <TournamentView tournament={tournamentData} />
    </main>
  );
}
