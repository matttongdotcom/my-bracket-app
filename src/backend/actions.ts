'use server'

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { TournamentResponseObject, TournamentSummary, RoundData } from '@/types/tournament';

export async function getAllTournaments(): Promise<TournamentSummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(t => ({
    id: t.id,
    name: t.name,
    status: t.status,
    currentRound: t.current_round,
    totalEntrants: t.total_entrants,
    createdAt: t.created_at,
  }));
}

export async function getTournamentPageData(tournamentId: string): Promise<{
  tournament: TournamentResponseObject | null;
  userVotes: Record<string, string>;
}> {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  // Batch 1: fetch user, tournament, matchups, and entrants in parallel
  const [userRes, tRes, mRes, eRes] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('tournaments').select('*').eq('id', tournamentId).single(),
    supabase.from('matchups').select('*').eq('tournament_id', tournamentId).order('match_index', { ascending: true }),
    supabase.from('entrants').select('*').eq('tournament_id', tournamentId),
  ]);

  if (tRes.error || !tRes.data) return { tournament: null, userVotes: {} };

  const tournament = tRes.data;
  const allMatchups = mRes.data || [];
  const allEntrants = eRes.data || [];
  const currentUserId = userRes.data?.user?.id;

  // Batch 2: fetch votes for all matchups
  const matchupIds = allMatchups.map(m => m.id);
  const { data: allVotes } = await adminClient
    .from('votes')
    .select('matchup_id, selected_entrant_id, user_id')
    .in('matchup_id', matchupIds);

  // Batch 3: fetch display names from profiles table
  const voterIds = [...new Set((allVotes || []).map(v => v.user_id))];
  const voterNameMap: Record<string, string> = {};

  if (voterIds.length > 0) {
    const { data: profiles } = await adminClient
      .from('profiles')
      .select('id, display_name')
      .in('id', voterIds);

    if (profiles) {
      profiles.forEach(p => {
        voterNameMap[p.id] = p.display_name || 'Anonymous';
      });
    }
  }

  // Build voter display names map per matchup
  const votersByMatchup: Record<string, Record<string, string[]>> = {};
  (allVotes || []).forEach(v => {
    if (!votersByMatchup[v.matchup_id]) votersByMatchup[v.matchup_id] = {};
    if (!votersByMatchup[v.matchup_id][v.selected_entrant_id]) votersByMatchup[v.matchup_id][v.selected_entrant_id] = [];
    votersByMatchup[v.matchup_id][v.selected_entrant_id].push(voterNameMap[v.user_id] || 'Anonymous');
  });

  // Extract current user's votes from the same dataset
  const userVotes: Record<string, string> = {};
  if (currentUserId) {
    (allVotes || []).filter(v => v.user_id === currentUserId).forEach(v => {
      userVotes[v.matchup_id] = v.selected_entrant_id;
    });
  }

  // Group matchups by round
  const roundsMap: Record<number, RoundData> = {};
  allMatchups.forEach((m) => {
    if (!roundsMap[m.round_number]) {
      roundsMap[m.round_number] = { roundNumber: m.round_number, label: `Round ${m.round_number}`, matchups: [] };
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

  return {
    tournament: {
      id: tournament.id,
      name: tournament.name,
      status: tournament.status,
      currentRound: tournament.current_round,
      totalEntrants: tournament.total_entrants,
      rounds: Object.values(roundsMap).sort((a, b) => a.roundNumber - b.roundNumber),
    },
    userVotes,
  };
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
