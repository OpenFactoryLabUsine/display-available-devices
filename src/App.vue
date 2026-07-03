<template>
  <div id="app">
    <header class="main-header">
      <h1>État Lab-Usine</h1>
    </header>

    <main class="content">
      <EquipmentMonitor />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
}

#app {
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
}

.main-header {
  padding: 20px 40px;
  border-bottom: 2px solid #f0f0f0;
  background: #ffffff;
  width: 100%;
}

.content {
  flex: 1;
  padding: 20px 40px;
  background-color: #fafafa;
  width: 100%;
}
</style>
<script setup lang="ts">
import EquipmentMonitor from "./components/EquipmentMonitor.vue";
</script>