import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { createPinia } from 'pinia'
import {useEquipmentStore} from "@/stores/equipmentStore.js";

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
const store = useEquipmentStore();
window.store = store;
app.mount('#app')