'use client';

import { useState } from 'react';
import { TournamentResponseObject, RoundData } from '@/types/tournament';
import MatchupCard from './MatchupCard';

interface TournamentViewProps {
  tournament: TournamentResponseObject;
}

export default function TournamentView({ tournament }: TournamentViewProps) {
  const [activeRoundIndex, setActiveRoundIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});

  const rounds = tournament.rounds || [];
  const activeRound = rounds[activeRoundIndex];

  // Helper to toggle selection
  const handleSelect = (matchId: string, entrantId: string) => {
    setSelections(prev => {
      const current = prev[matchId];
      // If clicking the already selected one, deselect it
      if (current === entrantId) {
        const copy = { ...prev };
        delete copy[matchId];
        return copy;
      }
      // Otherwise set new selection
      return { ...prev, [matchId]: entrantId };
    });
  };

  // Validation Logic
  const voteableMatchups = activeRound?.matchups.filter(m => m.is_active && !m.winner_id) || [];
  const hasVoteableMatchups = voteableMatchups.length > 0;
  const allSelected = hasVoteableMatchups && voteableMatchups.every(m => selections[m.id]);

  const handleSubmit = () => {
    if (!allSelected) return;
    console.log('Submitting votes:', selections);
    // TODO: Implement actual submission logic
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col min-h-screen bg-slate-50 relative">
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
      <div className="flex-1 p-4 space-y-4 pb-32">
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
                  selectedId={selections[matchup.id] || null}
                  onSelect={(entrantId) => handleSelect(matchup.id, entrantId)}
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

      {/* CTA Footer */}
      {hasVoteableMatchups && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button
            onClick={handleSubmit}
            disabled={!allSelected}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
              allSelected
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {allSelected ? 'Submit Picks' : `Make ${voteableMatchups.length - Object.keys(selections).filter(k => voteableMatchups.find(m => m.id === k)).length} more selection(s)`}
          </button>
        </div>
      )}
    </div>
  );
}
