import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bqquqrypamjaydzesxbh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcXVxcnlwYW1qYXlkemVzeGJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTc3NDYsImV4cCI6MjA5Njc3Mzc0Nn0.hALUfIOqRIPYwNgtKLE8nTyAW8utyC-SsUf5AhOFD1Y";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);