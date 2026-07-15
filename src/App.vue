<template>
  <div id="app">
    <header class="main-header">
      <h1>Lab-Usine Monitor</h1>
    </header>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style>
.main-header {
  padding: 1.5rem 2rem;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
