'use server'

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { TournamentResponseObject, RoundData } from '@/types/tournament';

export async function getFullTournament(tournamentId: string): Promise<TournamentResponseObject | null> {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  // 1. Fetch tournament, matchups, and entrants in parallel
  const [tRes, mRes, eRes] = await Promise.all([
    supabase.from('tournaments').select('*').eq('id', tournamentId).single(),
    supabase.from('matchups').select('*').eq('tournament_id', tournamentId).order('match_index', { ascending: true }),
    supabase.from('entrants').select('*').eq('tournament_id', tournamentId),
  ]);

  if (tRes.error || !tRes.data) return null;

  const tournament = tRes.data;
  const allMatchups = mRes.data || [];
  const allEntrants = eRes.data || [];

  // Fetch all votes for this tournament's matchups
  const matchupIds = allMatchups.map(m => m.id);
  const { data: allVotes } = await adminClient
    .from('votes')
    .select('matchup_id, selected_entrant_id, user_id')
    .in('matchup_id', matchupIds);

  // Fetch display names for all voters
  const voterIds = [...new Set((allVotes || []).map(v => v.user_id))];
  const voterNameMap: Record<string, string> = {};

  if (voterIds.length > 0) {
    const { data: { users } } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
    if (users) {
      users.forEach(u => {
        if (voterIds.includes(u.id)) {
          voterNameMap[u.id] = u.user_metadata?.display_name || 'empty';
        }
      });
    }
  }

  // Build a map: matchup_id -> entrant_id -> voter display names
  const votersByMatchup: Record<string, Record<string, string[]>> = {};
  (allVotes || []).forEach(v => {
    if (!votersByMatchup[v.matchup_id]) {
      votersByMatchup[v.matchup_id] = {};
    }
    if (!votersByMatchup[v.matchup_id][v.selected_entrant_id]) {
      votersByMatchup[v.matchup_id][v.selected_entrant_id] = [];
    }
    votersByMatchup[v.matchup_id][v.selected_entrant_id].push(
      voterNameMap[v.user_id] || 'empty'
    );
  });

  // 2. Group matchups by round_number
  const roundsMap: Record<number, RoundData> = {};

  allMatchups.forEach((m) => {
    if (!roundsMap[m.round_number]) {
      roundsMap[m.round_number] = {
        roundNumber: m.round_number,
        label: `Round ${m.round_number}`,
        matchups: []
      };
    }

    const entrant1 = allEntrants.find(e => e.id === m.entrant_1_id) || null;
    const entrant2 = allEntrants.find(e => e.id === m.entrant_2_id) || null;

    roundsMap[m.round_number].matchups.push({
      id: m.id,
      matchIndex: m.match_index,
      is_active: m.is_active,
      winner_id: m.winner_id,
      totalVotes: 0,
      entrant1: entrant1 ? { ...entrant1, votesInMatch: 0 } : null,
      entrant2: entrant2 ? { ...entrant2, votesInMatch: 0 } : null,
      votersByEntrant: votersByMatchup[m.id] || {},
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

export async function getUserVotes(
  tournamentId: string
): Promise<Record<string, string>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return {};

  const adminClient = createAdminClient();

  // Get all matchup IDs for this tournament
  const { data: matchups } = await adminClient
    .from('matchups')
    .select('id')
    .eq('tournament_id', tournamentId);

  if (!matchups || matchups.length === 0) return {};

  const matchupIds = matchups.map(m => m.id);

  // Fetch this user's votes for those matchups
  const { data: votes } = await adminClient
    .from('votes')
    .select('matchup_id, selected_entrant_id')
    .eq('user_id', user.id)
    .in('matchup_id', matchupIds);

  if (!votes) return {};

  // Return as a map of matchup_id -> selected_entrant_id
  const selectionsMap: Record<string, string> = {};
  votes.forEach(v => {
    selectionsMap[v.matchup_id] = v.selected_entrant_id;
  });
  return selectionsMap;
}

export async function submitVotes(
  selections: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  // Use the regular client to verify the user's identity
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'You must be signed in to vote.' };
  }

  // Use the admin client (service role) for the database write, bypassing RLS
  const adminClient = createAdminClient();

  const votes = Object.entries(selections).map(([matchup_id, selected_entrant_id]) => ({
    user_id: user.id,
    matchup_id,
    selected_entrant_id,
  }));

  const { error } = await adminClient.from('votes').upsert(votes, {
    onConflict: 'user_id,matchup_id',
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
