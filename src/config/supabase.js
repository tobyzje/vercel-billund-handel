import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ezbbryfumhyyzdtczezv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6YmJyeWZ1bWh5eXpkdGN6ZXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwODY3NjQsImV4cCI6MjA0ODY2Mjc2NH0.n_KjShDRPxgjDh1hsel7OVeTCXAcuoIeEGNc3-Auoks'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 