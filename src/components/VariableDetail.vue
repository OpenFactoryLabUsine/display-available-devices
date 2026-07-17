<template>
  <div class="detail-container">
    <router-link to="/" class="back-btn">← Retour aux capteurs</router-link>

    <div class="card" v-if="equipment && equipment.variables">
      <h2>{{ variable }}</h2>
      <p class="asset-id">Asset: {{ asset_uuid }}</p>

      <div class="live-value">
        Current value: {{ equipment.variables[variable]?.value}} mg/m³
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

.live-value { color: var(--text-muted); margin-bottom: 2rem; }

</style>

<script setup>
import { computed, onMounted} from 'vue';
import { useEquipmentStore } from '@/stores/equipmentStore';
import { Line } from 'vue-chartjs';
import { useRoute } from 'vue-router';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const route = useRoute();
const store = useEquipmentStore();

const asset_uuid = computed(() => route.params.asset_uuid);
const variable = computed(() => route.params.variable);

onMounted(async () => {
  if (store.equipments.length === 0) {
    await store.connectToEquipments();
  }
});

const equipment = computed(() => {
  return store.equipments.find(e => e.asset_uuid === asset_uuid.value);
});

const chartData = computed(() => {
  const variableHistory = equipment.value?.history?.[variable.value] || [];

  return {
    labels: variableHistory.map(p => p.x),
    datasets: [{
      label: variable.value.replace(/_/g, ' '),
      data: variableHistory.map(p => p.y),
      pointBackgroundColor: variableHistory.map(p => p.isAnomalous ? '#ef4444' : '#3b82f6'),
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