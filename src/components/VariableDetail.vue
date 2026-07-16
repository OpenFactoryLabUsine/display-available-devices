<template>
  <div class="detail-container">
    <router-link to="/" class="back-btn">← Retour aux capteurs</router-link>

    <div class="card" v-if="equipment && equipment.variables">
      <h2>{{ variable }}</h2>
      <p class="asset-id">Asset: {{ asset_uuid }}</p>

      <div class="live-value">
        {{ equipment.variables[variable]?.value }}
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
import { computed, onMounted, ref, watch } from 'vue';
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

const history = ref([]);
const MAX_HISTORY_SIZE = 100;

onMounted(async () => {
  if (store.equipments.length === 0) {
    await store.connectToEquipments();
  }
});

const equipment = computed(() => {
  return store.equipments.find(e => e.asset_uuid === asset_uuid.value);
});

watch(() => store.equipments, (newEquipments) => {
  const eq = newEquipments.find(e => e.asset_uuid === asset_uuid.value);
  if (eq && eq.variables && eq.variables[variable.value]) {
    const dataPoint = eq.variables[variable.value];

    history.value.push({
      x: new Date(dataPoint.timestamp).toLocaleTimeString(),
      y: dataPoint.value
    });

    if (history.value.length > MAX_HISTORY_SIZE) {
      history.value.shift();
    }
  }
}, { deep: true });

const chartData = computed(() => {
  return {
    labels: history.value.map(point => point.x),
    datasets: [{
      label: variable.value.replace(/_/g, ' '),
      data: history.value.map(point => point.y),
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