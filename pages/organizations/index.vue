<template>
  <section class="page">
    <header class="page__header">
      <div>
        <h2>Organizações</h2>
        <p>Gerencie o acesso e o período de testes.</p>
      </div>
    </header>

    <form class="filters" @submit.prevent="refresh">
      <div class="field">
        <label for="search">Busca</label>
        <input
          id="search"
          v-model="filters.search"
          type="search"
          placeholder="CNPJ, razão social ou nome fantasia"
        />
      </div>
      <div class="field">
        <label for="trial-status">Status do teste</label>
        <select id="trial-status" v-model="filters.trialStatus">
          <option value="">Todos</option>
          <option value="active">Ativo</option>
          <option value="expired">Expirado</option>
        </select>
      </div>
      <div class="field">
        <label for="access-status">Status do acesso</label>
        <select id="access-status" v-model="filters.accessStatus">
          <option value="">Todos</option>
          <option value="active">Ativo</option>
          <option value="expired">Expirado</option>
          <option value="never">Nunca liberado</option>
        </select>
      </div>
      <button class="button" type="submit">Aplicar filtros</button>
    </form>

    <div v-if="pending" class="status">Carregando organizações...</div>
    <div v-else-if="error" class="status status--error">
      Erro ao carregar organizações: {{ error.message }}
    </div>
    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <th>Organização</th>
            <th>CNPJ</th>
            <th>Teste</th>
            <th>Acesso</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="org in organizations" :key="org.id">
            <td>
              <strong>{{ org.nome_fantasia || org.razao_social || 'Sem nome' }}</strong>
              <div class="muted">{{ org.razao_social }}</div>
            </td>
            <td>{{ org.cnpj || '---' }}</td>
            <td>{{ formatDate(org.trial_ends_at) }}</td>
            <td>
              <span :class="['pill', accessClass(org)]">
                {{ accessLabel(org) }}
              </span>
            </td>
            <td>
              <NuxtLink :to="`/organizations/${org.id}`">Detalhes</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="organizations.length === 0" class="status">Nenhuma organização encontrada.</div>
    </div>
  </section>
</template>

<script setup lang="ts">
const filters = reactive({
  search: '',
  trialStatus: '',
  accessStatus: ''
});

const { data, pending, error, refresh } = await useFetch('/api/organizations', {
  query: filters
});

const organizations = computed(() => data.value?.data ?? []);

const formatDate = (value: string | null) => {
  if (!value) return '---';
  return new Date(value).toLocaleString('pt-BR', { timeZone: 'UTC' });
};

const accessLabel = (org: Record<string, string | null>) => {
  const now = new Date();
  const accessUntil = org.access_granted_until ? new Date(org.access_granted_until) : null;
  if (!accessUntil) return 'Nunca liberado';
  return accessUntil > now ? 'Ativo' : 'Expirado';
};

const accessClass = (org: Record<string, string | null>) => {
  const now = new Date();
  const accessUntil = org.access_granted_until ? new Date(org.access_granted_until) : null;
  if (!accessUntil) return 'pill--neutral';
  return accessUntil > now ? 'pill--success' : 'pill--warning';
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page__header h2 {
  margin: 0;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

input,
select {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.button {
  align-self: end;
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
}

.table th,
.table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

.muted {
  color: #64748b;
  font-size: 12px;
}

.pill {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.pill--success {
  background: #dcfce7;
  color: #166534;
}

.pill--warning {
  background: #fef3c7;
  color: #92400e;
}

.pill--neutral {
  background: #e2e8f0;
  color: #1f2937;
}

.status {
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.05);
}

.status--error {
  background: #fee2e2;
  color: #991b1b;
}
</style>
