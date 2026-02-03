import { createSupabaseServerClient } from '../../../utils/supabase';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const adminId = getHeader(event, 'x-admin-id');

  if (!adminId) {
    throw createError({ statusCode: 401, statusMessage: 'Missing admin identifier.' });
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from('organizations')
    .update({
      access_granted_until: null,
      access_granted_by: adminId,
      access_granted_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return { message: 'Acesso inativado com sucesso.' };
});
