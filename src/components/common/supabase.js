import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://joqtrwieeuytpnivqomd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvcXRyd2llZXV5dHBuaXZxb21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NzMxNDksImV4cCI6MjA4MjU0OTE0OX0.SBZi8_9Umpv4LF3ACsM70jobCVQSlSUfSI2VvzDp0nI';

export const supabase = createClient(supabaseUrl, supabaseKey);
