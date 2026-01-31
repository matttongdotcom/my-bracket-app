'use client'

import { useState } from 'react';
import { Participant } from '@/types/tournament';

interface MatchupCardProps {
  matchId: string;
  entrant1: Participant | null;
  entrant2: Participant | null;
  isActive: boolean;
  winnerId: string | null;
}

export default function MatchupCard({ matchId, entrant1, entrant2, isActive, winnerId }: MatchupCardProps) {
  const [votingFor, setVotingFor] = useState<string | null>(null);

//   const handleVote = async (entrantId: string) => {
//     if (!isActive || votingFor) return;
//     setVotingFor(entrantId);
    
//     try {
//       await submitVote(matchId, entrantId);
//       // Success! You might want to trigger a refresh or show a toast here
//     } catch (err) {
//       console.error(err);
//       setVotingFor(null); // Reset on error
//     }
//   };

  const renderEntrant = (entrant: Participant | null, isFirst: boolean) => {
    if (!entrant) {
      return (
        <div className="flex items-center p-4 bg-slate-50 text-slate-400 italic rounded-lg border border-dashed border-slate-200">
          TBD
        </div>
      );
    }

    const isWinner = winnerId === entrant.id;
    const isVoting = votingFor === entrant.id;

    return (
      <button
        // onClick={() => handleVote(entrant.id) }
        disabled={!isActive || !!votingFor}
        className={`relative w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all active:scale-95 ${
          isWinner ? 'border-green-500 bg-green-50' : 
          isVoting ? 'border-blue-500 bg-blue-50 animate-pulse' :
          'border-slate-200 bg-white hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400">#{entrant.seed}</span>
          <span className={`font-semibold ${isWinner ? 'text-green-700' : 'text-slate-800'}`}>
            {entrant.name}
          </span>
        </div>
        
        {isActive && !votingFor && (
          <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center">
             <div className="w-2 h-2 rounded-full bg-transparent" />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="relative flex flex-col gap-2 p-2 bg-white rounded-2xl shadow-sm border border-slate-100">
      {renderEntrant(entrant1, true)}
      
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-1 rounded-full border-2 border-white uppercase tracking-tighter">
          VS
        </div>
      </div>

      {renderEntrant(entrant2, false)}
    </div>
  );
}