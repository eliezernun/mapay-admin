import { createSupabaseServerClient } from '../utils/supabase';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const search = typeof query.search === 'string' ? query.search.trim() : '';
  const trialStatus = typeof query.trialStatus === 'string' ? query.trialStatus : '';
  const accessStatus = typeof query.accessStatus === 'string' ? query.accessStatus : '';

  const supabase = createSupabaseServerClient();
  let builder = supabase
    .from('organizations')
    .select('id, cnpj, nome_fantasia, razao_social, trial_ends_at, access_granted_until', {
      count: 'exact'
    })
    .order('created_at', { ascending: false })
    .limit(50);

  if (search) {
    builder = builder.or(
      `cnpj.ilike.%${search}%,nome_fantasia.ilike.%${search}%,razao_social.ilike.%${search}%`
    );
  }

  const now = new Date().toISOString();

  if (trialStatus === 'active') {
    builder = builder.gt('trial_ends_at', now);
  }

  if (trialStatus === 'expired') {
    builder = builder.lte('trial_ends_at', now);
  }

  if (accessStatus === 'active') {
    builder = builder.gt('access_granted_until', now);
  }

  if (accessStatus === 'expired') {
    builder = builder.lte('access_granted_until', now);
  }

  if (accessStatus === 'never') {
    builder = builder.is('access_granted_until', null);
  }

  const { data, error, count } = await builder;

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return { data, count };
});
