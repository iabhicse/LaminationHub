// Supabase Dashboard > Project Settings > API से Project URL और anon/public key डालें.
// anon key को RLS policies के साथ ही इस्तेमाल करें; service_role key कभी भी वेबसाइट में न डालें.
window.SUPABASE_CONFIG = {
  url: "YOUR_SUPABASE_PROJECT_URL",
  anonKey: "YOUR_SUPABASE_ANON_KEY"
};