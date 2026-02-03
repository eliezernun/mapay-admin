<template>
  <section class="page">
    <NuxtLink class="back" to="/organizations">← Voltar</NuxtLink>

    <div v-if="pending" class="status">Carregando dados...</div>
    <div v-else-if="error" class="status status--error">
      Erro ao carregar organização: {{ error.message }}
    </div>
    <div v-else-if="organization" class="content">
      <header class="header">
        <div>
          <h2>{{ organization.legal_name || organization.trade_name || 'Organização' }}</h2>
          <p class="muted">CNPJ: {{ organization.cnpj || '---' }}</p>
        </div>
        <span :class="['pill', accessClass]">{{ accessLabel }}</span>
      </header>

      <div class="grid">
        <div class="card">
          <h3>Dados do acesso</h3>
          <ul>
            <li><strong>Criada em:</strong> {{ formatDate(organization.created_at) }}</li>
            <li><strong>Teste até:</strong> {{ formatDate(organization.trial_ends_at) }}</li>
            <li><strong>Acesso liberado em:</strong> {{ formatDate(organization.access_granted_at) }}</li>
            <li><strong>Acesso válido até:</strong> {{ formatDate(organization.access_granted_until) }}</li>
          </ul>
        </div>
        <div class="card">
          <h3>Liberar acesso</h3>
          <form @submit.prevent="grantAccess">
            <label for="admin-id">Admin ID</label>
            <input id="admin-id" v-model="adminId" type="text" placeholder="UUID do admin" required />
            <label for="days">Dias de liberação</label>
            <input id="days" v-model.number="grantDays" type="number" min="1" required />
            <button class="button" type="submit" :disabled="actionPending">Confirmar liberação</button>
          </form>
          <p v-if="actionMessage" class="status status--success">{{ actionMessage }}</p>
          <p v-if="actionError" class="status status--error">{{ actionError }}</p>
        </div>
        <div class="card">
          <h3>Inativar acesso</h3>
          <p>Remove a liberação atual e bloqueia o acesso imediatamente.</p>
          <button class="button button--danger" :disabled="actionPending" @click="revokeAccess">
            Inativar acesso agora
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const route = useRoute();
const id = route.params.id as string;

const { data, pending, error, refresh } = await useFetch(`/api/organizations/${id}`);
const organization = computed(() => data.value?.data ?? null);

const grantDays = ref(15);
const adminId = ref('');
const actionPending = ref(false);
const actionMessage = ref('');
const actionError = ref('');

const formatDate = (value: string | null) => {
  if (!value) return '---';
  return new Date(value).toLocaleString('pt-BR', { timeZone: 'UTC' });
};

const accessLabel = computed(() => {
  const accessUntil = organization.value?.access_granted_until;
  if (!accessUntil) return 'Acesso bloqueado';
  return new Date(accessUntil) > new Date() ? 'Acesso ativo' : 'Acesso expirado';
});

const accessClass = computed(() => {
  const accessUntil = organization.value?.access_granted_until;
  if (!accessUntil) return 'pill--neutral';
  return new Date(accessUntil) > new Date() ? 'pill--success' : 'pill--warning';
});

const grantAccess = async () => {
  actionMessage.value = '';
  actionError.value = '';
  actionPending.value = true;

  try {
    const response = await $fetch(`/api/organizations/${id}/grant`, {
      method: 'POST',
      body: { days: grantDays.value },
      headers: { 'x-admin-id': adminId.value }
    });
    actionMessage.value = response.message;
    await refresh();
  } catch (err: any) {
    actionError.value = err?.data?.message || 'Falha ao liberar acesso.';
  } finally {
    actionPending.value = false;
  }
};

const revokeAccess = async () => {
  actionMessage.value = '';
  actionError.value = '';
  actionPending.value = true;

  try {
    const response = await $fetch(`/api/organizations/${id}/revoke`, {
      method: 'POST',
      headers: { 'x-admin-id': adminId.value }
    });
    actionMessage.value = response.message;
    await refresh();
  } catch (err: any) {
    actionError.value = err?.data?.message || 'Falha ao inativar acesso.';
  } finally {
    actionPending.value = false;
  }
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.back {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
}

.grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.card {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

input {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.button {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.button--danger {
  background: #dc2626;
}

.pill {
  padding: 6px 14px;
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
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
}

.status--error {
  background: #fee2e2;
  color: #991b1b;
}

.status--success {
  background: #dcfce7;
  color: #166534;
}

.muted {
  color: #64748b;
}
</style>
