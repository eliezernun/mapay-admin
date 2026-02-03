import { createSupabaseServerClient } from '../../../utils/supabase';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);
  const days = Number(body?.days);

  if (!Number.isInteger(days) || days <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Days must be a positive integer.' });
  }

  const adminId = getHeader(event, 'x-admin-id');
  if (!adminId) {
    throw createError({ statusCode: 401, statusMessage: 'Missing admin identifier.' });
  }

  const supabase = createSupabaseServerClient();
  const now = new Date();
  const accessGrantedUntil = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase
    .from('organizations')
    .update({
      access_granted_at: now.toISOString(),
      access_granted_until: accessGrantedUntil,
      access_granted_by: adminId
    })
    .eq('id', id);

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return { message: `Acesso liberado por ${days} dias.` };
});
