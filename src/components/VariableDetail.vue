<template>
  <div class="detail-container">
    <router-link to="/" class="back-btn">← Retour aux capteurs</router-link>

    <div class="card" v-if="equipment">
      <h2>{{ variable.replace(/_/g, ' ') }}</h2>
      <p class="asset-id">Asset: {{ asset_uuid }}</p>

      <div class="live-value">
        {{ equipment.variables[variable] }}
      </div>

      <div class="chart-wrapper">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <div v-else>Loading device data...</div>
  </div>
</template>

<style scoped>
.back-btn {
  display: inline-block;
  margin-bottom: 1rem;
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
}
.card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}
.asset-id { color: var(--text-muted); margin-bottom: 2rem; }
</style>

<script setup>
import {computed, onMounted, ref} from 'vue';
import { useEquipmentStore } from '@/stores/equipmentStore';
import { Line } from 'vue-chartjs';

const props = defineProps(['asset_uuid', 'variable']);
const store = useEquipmentStore();
const isLoading = ref(true);

onMounted(async () => {
  if (store.equipments.length === 0) {
    await store.connectToEquipments();
  }
  isLoading.value = false;
});

const equipment = computed(() =>
    console.log(store.equipments)
);

const chartData = computed(() => {
  if (!equipment.value || !equipment.value.variables) return { labels: [], datasets: [] };

  return {
    labels: ['Now'],
    datasets: [{
      label: props.variable.replace(/_/g, ' '),
      data: [equipment.value.variables[props.variable]],
      borderColor: '#3b82f6',
      tension: 0.1
    }]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
};
</script>