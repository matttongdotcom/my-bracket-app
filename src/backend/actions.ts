'use server'

import { supabase } from '@/utils/supabase';
import { TournamentResponseObject, RoundData } from '@/types/tournament';

export async function getFullTournament(tournamentId: string): Promise<TournamentResponseObject | null> {
  // 1. Fetch all data in parallel
  const [tRes, mRes, eRes] = await Promise.all([
    supabase.from('tournaments').select('*').eq('id', tournamentId).single(),
    supabase.from('matchups').select('*').eq('tournament_id', tournamentId).order('match_index', { ascending: true }),
    supabase.from('entrants').select('*').eq('tournament_id', tournamentId)
  ]);

  if (tRes.error || !tRes.data) return null;

  const tournament = tRes.data;
  const allMatchups = mRes.data || [];
  const allEntrants = eRes.data || [];

  // 2. Group matchups by round_number
  const roundsMap: Record<number, RoundData> = {};

  allMatchups.forEach((m) => {
    if (!roundsMap[m.round_number]) {
      roundsMap[m.round_number] = {
        roundNumber: m.round_number,
        label: `Round ${m.round_number}`, // You can customize this (e.g., "Finals")
        matchups: []
      };
    }

    // Link the raw IDs to the full Entrant objects
    const entrant1 = allEntrants.find(e => e.id === m.entrant_1_id) || null;
    const entrant2 = allEntrants.find(e => e.id === m.entrant_2_id) || null;

    roundsMap[m.round_number].matchups.push({
      id: m.id,
      matchIndex: m.match_index,
      is_active: m.is_active,
      winner_id: m.winner_id,
      totalVotes: 0, // In a real app, you'd fetch/aggregate votes here
      entrant1: entrant1 ? { ...entrant1, votesInMatch: 0 } : null,
      entrant2: entrant2 ? { ...entrant2, votesInMatch: 0 } : null,
    });
  });

  // 3. Assemble the final nested object
  return {
    id: tournament.id,
    name: tournament.name,
    status: tournament.status,
    currentRound: tournament.current_round,
    totalEntrants: tournament.total_entrants,
    rounds: Object.values(roundsMap).sort((a, b) => a.roundNumber - b.roundNumber)
  };
}