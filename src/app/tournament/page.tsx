import Link from 'next/link';
import { getAllTournaments } from '@/backend/actions';

export default async function TournamentsListPage() {
  const tournaments = await getAllTournaments();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="w-full max-w-md mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Tournaments</h1>
          <p className="text-sm text-slate-500 mt-1">Select a tournament to view or vote</p>
        </div>

        {tournaments.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No tournaments available yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tournaments.map((t) => {
              const statusColor = t.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : t.status === 'voting'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-amber-100 text-amber-700';

              return (
                <Link
                  key={t.id}
                  href={`/tournament/${t.id}`}
                  className="block p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold text-slate-800 truncate">{t.name}</h2>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase ${statusColor}`}>
                          {t.status}
                        </span>
                        <span className="text-xs text-slate-400">
                          {t.totalEntrants} entrants
                        </span>
                        {t.status !== 'completed' && (
                          <span className="text-xs text-slate-400">
                            Round {t.currentRound}
                          </span>
                        )}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-slate-300 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
