<template>
  <div class="home">
    <h2>Bem-vindo ao painel administrativo</h2>
    <p>Use o menu para gerenciar o acesso das organizações.</p>
    <NuxtLink class="home__link" to="/organizations">Ir para lista de organizações</NuxtLink>
  </div>
</template>

<style scoped>
.home {
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
}

.home__link {
  display: inline-block;
  margin-top: 16px;
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}
</style>
