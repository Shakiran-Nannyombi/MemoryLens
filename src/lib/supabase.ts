import { createClient } from '@supabase/supabase-js';

// We use hardcoded placeholders so the app compiles and runs in preview mode
// without crashing, allowing the user to provide real keys.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
