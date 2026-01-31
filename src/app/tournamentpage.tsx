// src/app/tournament/[id]/page.tsx
import { getFullTournament } from '@/backend/actions';

export default async function Page({ params }: { params: { id: string } }) {
  // 1. Fetch the data using the action we just wrote
  const data = await getFullTournament(params.id);

  // 2. Error handling if the ID is wrong or Supabase fails
  if (!data) {
    return (
      <div className="p-8 text-red-500 font-mono">
        Error: Tournament not found or connection failed.
      </div>
    );
  }

  // 3. Output the raw data as a formatted string
  return (
    <main className="p-4 bg-slate-900 min-h-screen">
      <h1 className="text-white text-xl font-bold mb-4">Debug: Tournament Data</h1>
      
      <div className="bg-black border border-slate-700 rounded-lg p-4 overflow-auto">
        <pre className="text-green-400 text-sm font-mono">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
      
      <p className="mt-4 text-slate-400 text-xs italic">
        If you see a JSON object above, your Next.js - Server Action - Supabase connection is 100% functional.
      </p>
    </main>
  );
}