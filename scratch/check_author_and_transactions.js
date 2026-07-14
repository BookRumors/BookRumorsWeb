const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    env[key] = val;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('--- FETCHING AUTHORS ---');
  const { data: authors, error: authErr } = await supabase.from('br_authors').select('*');
  if (authErr) {
    console.error('Authors fetch failed:', authErr.message);
  } else {
    console.log('Authors list:', authors.map(a => ({ id: a.id, name: a.name, email: a.email })));
  }

  console.log('\n--- FETCHING TRANSACTIONS ---');
  const { data: txs, error: txErr } = await supabase.from('br_transactions').select('*');
  if (txErr) {
    console.error('Transactions fetch failed:', txErr.message);
  } else {
    console.log('Transactions list:', txs);
  }
}

run();
