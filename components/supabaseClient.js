import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv';

config();

const supabaseUrl = "https://kkvjtubycchamfimduto.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtrdmp0dWJ5Y2NoYW1maW1kdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3NjMxNjgsImV4cCI6MjA0NTMzOTE2OH0.gdc-SDRU1ufacHf-JC-u1ZXfJ3YXLQWd6RHgKoZAJSI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);