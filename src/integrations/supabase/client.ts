// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iqevpgfdcpwejsliufue.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZXZwZ2ZkY3B3ZWpzbGl1ZnVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyNTgxNTgsImV4cCI6MjA0NjgzNDE1OH0.ms5l48mtv8kTPNaTFNm4ewysxuYWCZXjZD0wvHm2s5c";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);