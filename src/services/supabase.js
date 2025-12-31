import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://joqtrwieeuytpnivqomd.supabase.co';
const supabaseKey = 'sb_publishable__zAiN6S3SkY5sSuWKtHiyA_ksz4QTb3';

export const supabase = createClient(supabaseUrl, supabaseKey);
