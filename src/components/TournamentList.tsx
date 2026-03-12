'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TournamentSummary } from '@/types/tournament';

export default function TournamentList({ tournaments }: { tournaments: TournamentSummary[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No tournaments available yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tournaments.map((t) => {
        const statusColor = t.status === 'completed'
          ? 'bg-green-100 text-green-700'
          : t.status === 'voting'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-amber-100 text-amber-700';

        const isLoading = loadingId === t.id;

        return (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setLoadingId(t.id);
              router.push(`/tournament/${t.id}`);
            }}
            disabled={loadingId !== null}
            className="block w-full text-left p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all active:scale-[0.98] disabled:opacity-60"
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
              <div className="flex-shrink-0 ml-2">
                {isLoading ? (
                  <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
