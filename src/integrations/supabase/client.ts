import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kqmzwbipuhexyfugdlqj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Tp0MVP8RVQENk21XaSwTNQ_2MYrbb5j";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});