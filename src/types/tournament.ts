export type TournamentResponseObject = {
    id: string;
    name: string;
    status: 'open' | 'voting' | 'completed';
    currentRound: number;
    totalEntrants: number;
    // This is where the magic happens: a nested array of rounds
    rounds: RoundData[];
  };
  
  export type RoundData = {
    roundNumber: number;
    label: string; // e.g., "Round of 64", "Quarter-Finals", etc.
    matchups: MatchupWithEntrants[];
  };
  
  export type MatchupWithEntrants = {
    id: string;
    matchIndex: number;
    is_active: boolean;
    entrant1: Participant | null;
    entrant2: Participant | null;
    winner_id: string | null;
    totalVotes: number;
  };
  
  export type Participant = {
    id: string;
    name: string;
    image_url?: string;
    seed: number;
    votesInMatch: number; // Current vote count for this specific round
  };