'use client';

import MatchupCard from '@/components/MatchupCard';
import { Participant } from '@/types/tournament';

export default function Home() {
  // Sample Data
  const entrant1: Participant = {
    id: '1',
    name: 'Team Alpha',
    seed: 1,
    votesInMatch: 10,
  };

  const entrant2: Participant = {
    id: '2',
    name: 'Team Beta',
    seed: 16,
    votesInMatch: 5,
  };

  const entrant3: Participant = {
    id: '3',
    name: 'Team Gamma',
    seed: 5,
    votesInMatch: 20,
  };

  const entrant4: Participant = {
    id: '4',
    name: 'Team Delta',
    seed: 12,
    votesInMatch: 15,
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8 flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold text-slate-800">Matchup Card Preview</h1>
      
      <div className="w-full max-w-md flex flex-col gap-6">
        
        <section>
          <h2 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Active Matchup</h2>
          <MatchupCard 
            matchId="m1"
            entrant1={entrant1}
            entrant2={entrant2}
            isActive={true}
            winnerId={null}
          />
        </section>

        <section>
          <h2 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Completed Matchup (Winner: Team Gamma)</h2>
          <MatchupCard 
            matchId="m2"
            entrant1={entrant3}
            entrant2={entrant4}
            isActive={false}
            winnerId={entrant3.id}
          />
        </section>

        <section>
          <h2 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Pending Matchup (TBD)</h2>
          <MatchupCard 
            matchId="m3"
            entrant1={entrant1}
            entrant2={null}
            isActive={false}
            winnerId={null}
          />
        </section>

      </div>
    </main>
  );
}
