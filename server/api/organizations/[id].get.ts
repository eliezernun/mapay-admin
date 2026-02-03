import { createSupabaseServerClient } from '../../utils/supabase';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('organizations')
    .select(
      'id, cnpj, legal_name, trade_name, created_at, trial_ends_at, access_granted_at, access_granted_until, access_granted_by'
    )
    .eq('id', id)
    .single();

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return { data };
});
