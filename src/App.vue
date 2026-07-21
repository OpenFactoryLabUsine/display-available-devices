<template>
  <div id="app">
    <header class="main-header">
      <router-link to="/">
        <img src="@/components/icons/lab-usine-logo.png" alt="Lab-Usine Logo" class="logo" />
      </router-link>
      <h1 class="title">Tableau de bord des équipements disponibles</h1>
    </header>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style>
.main-header {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.logo {
  display: flex;
  margin: 0.5rem 1rem;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  width: 50px;
  height: 50px;
}

.title {
  font-size: 1.5rem;
  vertical-align: center;
}
.content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
