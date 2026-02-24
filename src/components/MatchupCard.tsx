'use client'

import { useState } from 'react';
import { Participant } from '@/types/tournament';

interface MatchupCardProps {
  matchId: string;
  entrant1: Participant | null;
  entrant2: Participant | null;
  isActive: boolean;
  winnerId: string | null;
  selectedId: string | null;
  onSelect: (entrantId: string) => void;
  votersByEntrant?: Record<string, string[]>;
}

export default function MatchupCard({ 
  matchId, 
  entrant1, 
  entrant2, 
  isActive, 
  winnerId, 
  selectedId, 
  onSelect,
  votersByEntrant = {},
}: MatchupCardProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  
  const handleSelect = (entrantId: string) => {
    if (!isActive) return;
    onSelect(entrantId);
  };

  const handleImageClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation(); // Prevent card selection
    setExpandedImage(url);
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
    const isDisabled = !isActive || !!winnerId;
    const voters = votersByEntrant[entrant.id] || [];

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
          <div className="flex flex-col items-start gap-1">
            {entrant.image_url && (
              <div 
                role="button"
                tabIndex={0}
                onClick={(e) => handleImageClick(e, entrant.image_url!)}
                className="relative w-12 h-12 rounded-md overflow-hidden bg-slate-100 border border-slate-200 hover:scale-105 transition-transform cursor-zoom-in active:scale-95"
              >
                <img 
                  src={entrant.image_url} 
                  alt={entrant.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <span className={`font-semibold text-left ${
              isWinner ? 'text-green-700' : 
              isSelected ? '!text-blue-700' : 'text-gray-900'
            }`}>
              {entrant.name}
            </span>
            {!!winnerId && voters.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {voters.map((name, i) => (
                  <span key={i} className="text-[11px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md">
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
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
    <>
      <div className="relative flex flex-col gap-2 p-2 bg-white rounded-2xl shadow-sm border border-slate-100">
        {renderEntrant(entrant1)}
        
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-1 rounded-full border-2 border-white uppercase tracking-tighter shadow-sm">
            VS
          </div>
        </div>

        {renderEntrant(entrant2)}
      </div>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setExpandedImage(null)}
        >
          <div 
            className="relative max-w-full max-h-full rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          >
            <img 
              src={expandedImage} 
              alt="Expanded view" 
              className="max-w-full max-h-[80vh] object-contain"
            />
            <button 
              onClick={() => setExpandedImage(null)}
              className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
