<template>
  <div class="monitor-container">
    <h2>Capteurs disponibles</h2>

    <div v-if="loading" class="status-message">
      Connecting to OpenFactory...
    </div>

    <div class="grid">
      <div v-for="eq in store.equipments" :key="eq.asset_uuid" class="card">
        <h3>{{ eq.asset_uuid }}</h3>

        <div class="badge-container">
          <RouterLink
              :to="{
                  name: 'VariableDetail',
                  params: { asset_uuid: eq.asset_uuid, variable: key }
                }"
                v-for="key in Object.keys(eq.variables || {})"
                :key="key"
                class="badge">
                {{ key.replace(/_/g, ' ') }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

h3 { margin: 0 0 15px 0; font-size: 1.1rem; color: #1e293b; }

.badge-container { display: flex; flex-wrap: wrap; gap: 8px; }
.badge {
  background: #f1f5f9;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.badge:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
  color: var(--primary-color);
}
</style>

<script setup>
import {onMounted, ref} from 'vue';
import { useEquipmentStore } from '@/stores/equipmentStore';

const loading = ref(true);
const store = useEquipmentStore();

onMounted(async () => {
  await store.connectToEquipments();
  loading.value = false;
});
</script>