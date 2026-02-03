export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseUrl: process.env.SUPABASE_URL,
    public: {
      appName: 'Mapay Admin'
    }
  }
});
