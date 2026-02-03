import { createClient } from '@supabase/supabase-js';

export const createSupabaseServerClient = () => {
  const config = useRuntimeConfig();

  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase environment variables are not configured.'
    });
  }

  return createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: { persistSession: false }
  });
};
