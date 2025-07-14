import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';


const SUPABASE_URL = 'https://gvcquogdmuovgtnizcsk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2Y3F1b2dkbXVvdmd0bml6Y3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0OTkwODYsImV4cCI6MjA2ODA3NTA4Nn0.xA3AgWp_y457i6wKyRC3oN2UvXwyzIu0qnl_U2gB41s';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);