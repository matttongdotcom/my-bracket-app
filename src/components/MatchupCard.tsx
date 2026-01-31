'use client'

import { Participant } from '@/types/tournament';

interface MatchupCardProps {
  matchId: string;
  entrant1: Participant | null;
  entrant2: Participant | null;
  isActive: boolean;
  winnerId: string | null;
  selectedId: string | null;
  onSelect: (entrantId: string) => void;
}

export default function MatchupCard({ 
  matchId, 
  entrant1, 
  entrant2, 
  isActive, 
  winnerId, 
  selectedId, 
  onSelect 
}: MatchupCardProps) {
  
  const handleSelect = (entrantId: string) => {
    if (!isActive) return;
    onSelect(entrantId);
  };

  const renderEntrant = (entrant: Participant | null) => {
    if (!entrant) {
      return (
        <div className="flex items-center p-4 bg-slate-50 text-slate-400 italic rounded-lg border border-dashed border-slate-200">
          TBD
        </div>
      );
    }

    const isWinner = winnerId === entrant.id;
    const isSelected = selectedId === entrant.id;
    // Disable interaction if the match is not active or if a winner is already decided
    const isDisabled = !isActive || !!winnerId;

    return (
      <button
        type="button"
        onClick={() => handleSelect(entrant.id)}
        disabled={isDisabled}
        className={`relative w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
          isWinner 
            ? 'border-green-500 bg-green-50' 
            : isSelected
              ? '!border-blue-600 !bg-blue-50 ring-2 ring-blue-100 z-10'
              : 'border-slate-200 bg-white hover:border-slate-300 active:scale-[0.98]'
        } ${isDisabled ? 'cursor-default opacity-50' : 'cursor-pointer opacity-100'}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400">#{entrant.seed}</span>
          <span className={`font-semibold text-left ${
            isWinner ? 'text-green-700' : 
            isSelected ? '!text-blue-700' : 'text-gray-900'
          }`}>
            {entrant.name}
          </span>
        </div>
        
        {/* Selection Indicator */}
        {isActive && !winnerId && (
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            isSelected 
              ? '!border-blue-600 !bg-blue-600' 
              : 'border-slate-200 bg-transparent'
          }`}>
            {isSelected && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        )}
        
        {/* Winner Indicator */}
        {isWinner && (
          <div className="bg-green-100 text-green-700 p-1 rounded-full">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="relative flex flex-col gap-2 p-2 bg-white rounded-2xl shadow-sm border border-slate-100">
      {renderEntrant(entrant1)}
      
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-1 rounded-full border-2 border-white uppercase tracking-tighter shadow-sm">
          VS
        </div>
      </div>

      {renderEntrant(entrant2)}
    </div>
  );
}
