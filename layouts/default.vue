<template>
  <div class="app">
    <header class="app__header">
      <div>
        <h1>{{ appName }}</h1>
        <p>Administração de acesso das organizações</p>
      </div>
      <nav>
        <NuxtLink to="/organizations">Organizações</NuxtLink>
      </nav>
    </header>
    <main class="app__main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const appName = config.public.appName;
</script>

<style scoped>
.app {
  font-family: 'Inter', system-ui, sans-serif;
  background: #f6f7fb;
  min-height: 100vh;
  color: #1f2937;
}

.app__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: #111827;
  color: #f9fafb;
}

.app__header a {
  color: #f9fafb;
  text-decoration: none;
  font-weight: 600;
}

.app__main {
  padding: 32px;
}
</style>
