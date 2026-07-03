<template>
  <div class="monitor-container">
    <h2>Capteurs disponibles</h2>

    <div v-if="loading" class="status-message">
      Connecting to live feed...
    </div>

    <div v-else class="grid">
      <div v-for="eq in equipments" :key="eq.asset_uuid" class="card">
        <h3>{{ eq.asset_uuid }}</h3>
        <div class="badge-container">
          <span v-for="key in Object.keys(eq.variables)" :key="key" class="badge">
            {{ key.replace(/_/g, ' ') }}
          </span>
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
  background: #e2e8f0;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #475569;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';

const equipments = ref([]);
const loading = ref(true);

onMounted(() => {
  const ws = new WebSocket("ws://equipments-api.labusine.local/equipments");

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // Check if the event is the list we expect
    if (data.event === "equipments_list") {
      equipments.value = data.equipments;
      loading.value = false;
    }
  };

  ws.onopen = () => console.log("Connected to OpenFactory API");
  ws.onerror = (err) => console.error("WebSocket Error:", err);
});
</script>