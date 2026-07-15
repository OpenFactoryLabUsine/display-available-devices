import { createRouter, createWebHistory } from 'vue-router';
import EquipmentMonitor from '../components/EquipmentMonitor.vue';
import VariableDetail from '../components/VariableDetail.vue';

const routes = [
    { path: '/', component: EquipmentMonitor },
    { path: '/monitor/:asset_uuid/:variable', name: 'VariableDetail', component: VariableDetail }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;