'use client';

import TournamentView from '@/components/TournamentView';
import { TournamentResponseObject, Participant } from '@/types/tournament';

export default function Home() {
  // --- Sample Data Generation ---
  
  const createParticipant = (id: string, name: string, seed: number): Participant => ({
    id,
    name,
    seed,
    votesInMatch: 0,
  });

  const entrants = [
    createParticipant('1', 'Crimson Tide', 1),
    createParticipant('2', 'Blue Devils', 2),
    createParticipant('3', 'Golden Eagles', 3),
    createParticipant('4', 'Fighting Irish', 4),
    createParticipant('5', 'Spartans', 5),
    createParticipant('6', 'Wolverines', 6),
    createParticipant('7', 'Buckeyes', 7),
    createParticipant('8', 'Gators', 8),
  ];

  const sampleTournament: TournamentResponseObject = {
    id: 't1',
    name: 'March Madness 2026',
    status: 'open',
    currentRound: 1,
    totalEntrants: 8,
    rounds: [
      {
        roundNumber: 1,
        label: 'Quarter-Finals',
        matchups: [
          {
            id: 'm1',
            matchIndex: 0,
            is_active: true,
            entrant1: entrants[0], // Seed 1
            entrant2: entrants[7], // Seed 8
            winner_id: null,
            totalVotes: 150,
          },
          {
            id: 'm2',
            matchIndex: 1,
            is_active: true,
            entrant1: entrants[3], // Seed 4
            entrant2: entrants[4], // Seed 5
            winner_id: null,
            totalVotes: 120,
          },
          {
            id: 'm3',
            matchIndex: 2,
            is_active: true,
            entrant1: entrants[2], // Seed 3
            entrant2: entrants[5], // Seed 6
            winner_id: null,
            totalVotes: 90,
          },
          {
            id: 'm4',
            matchIndex: 3,
            is_active: true,
            entrant1: entrants[1], // Seed 2
            entrant2: entrants[6], // Seed 7
            winner_id: null,
            totalVotes: 200,
          },
        ],
      },
      {
        roundNumber: 2,
        label: 'Semi-Finals',
        matchups: [
          {
            id: 'm5',
            matchIndex: 4,
            is_active: false,
            entrant1: null, // Winner of m1
            entrant2: null, // Winner of m2
            winner_id: null,
            totalVotes: 0,
          },
          {
            id: 'm6',
            matchIndex: 5,
            is_active: false,
            entrant1: null, // Winner of m3
            entrant2: null, // Winner of m4
            winner_id: null,
            totalVotes: 0,
          },
        ],
      },
      {
        roundNumber: 3,
        label: 'Championship',
        matchups: [
          {
            id: 'm7',
            matchIndex: 6,
            is_active: false,
            entrant1: null,
            entrant2: null,
            winner_id: null,
            totalVotes: 0,
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-100 flex justify-center">
      <TournamentView tournament={sampleTournament} />
    </main>
  );
}
