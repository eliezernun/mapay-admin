export default defineNuxtConfig({
  compatibilityDate: '2026-02-03',
  devtools: { enabled: true },
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseUrl: process.env.SUPABASE_URL,
    public: {
      appName: 'Mapay Admin'
    }
  }
});
