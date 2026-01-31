'use client';

import { useState } from 'react';
import { TournamentResponseObject, RoundData } from '@/types/tournament';
import MatchupCard from './MatchupCard';

interface TournamentViewProps {
  tournament: TournamentResponseObject;
}

export default function TournamentView({ tournament }: TournamentViewProps) {
  const [activeRoundIndex, setActiveRoundIndex] = useState(0);

  const rounds = tournament.rounds || [];
  const activeRound = rounds[activeRoundIndex];

  return (
    <div className="w-full max-w-md mx-auto flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200 shadow-sm z-10">
        <h1 className="text-xl font-bold text-slate-800">{tournament.name}</h1>
        <div className="text-xs text-slate-500 mt-1">
          {tournament.totalEntrants} Entrants • {tournament.status}
        </div>
      </div>

      {/* Tabs / Round Selector */}
      <div className="sticky top-0 bg-white z-10 border-b border-slate-200 overflow-x-auto no-scrollbar">
        <div className="flex px-4 gap-6">
          {rounds.map((round, index) => {
            const isActive = index === activeRoundIndex;
            return (
              <button
                key={round.roundNumber}
                onClick={() => setActiveRoundIndex(index)}
                className={`py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {round.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeRound ? (
          <>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {activeRound.label} Matches
            </div>
            <div className="flex flex-col gap-4">
              {activeRound.matchups.map((matchup) => (
                <MatchupCard
                  key={matchup.id}
                  matchId={matchup.id}
                  entrant1={matchup.entrant1}
                  entrant2={matchup.entrant2}
                  isActive={matchup.is_active}
                  winnerId={matchup.winner_id}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-slate-400">
            No rounds available.
          </div>
        )}
      </div>
    </div>
  );
}
