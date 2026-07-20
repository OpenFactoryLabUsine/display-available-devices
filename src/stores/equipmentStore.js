import { defineStore } from 'pinia';
import { useIqrModel } from '../composables/useIQRModel.js';
import modelsConfig from '../config/models_config.json';

const MAX_HISTORY_SIZE = 100;

export const useEquipmentStore = defineStore('equipment', {
    state: () => ({
        equipments: [],
        detailSockets: {},
        activeModels: {},
    }),

    actions: {
        connectToEquipments() {
            const ws = new WebSocket('ws://equipments-api.labusine.local/equipments');

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.event === 'ping') return;

                if (data && data.equipments) {
                    this.reconcileEquipments(data.equipments);
                } else {
                    console.warn("Unexpected WebSocket data format:", data);
                }
            };
        },

        reconcileEquipments(newList) {
            newList.forEach(newEq => {
                const existing = this.equipments.find(e => e.asset_uuid === newEq.asset_uuid);
                if (!existing) {
                    this.equipments.push(newEq);
                    this.subscribeToDetails(newEq.asset_uuid);
                } else {
                    Object.assign(existing, newEq);
                }
            });

            this.equipments = this.equipments.filter(e => newList.find(n => n.asset_uuid === e.asset_uuid));
        },

        async subscribeToDetails(uuid) {
            if (this.detailSockets[uuid]) return;
            const ws = new WebSocket(`ws://equipments-api.labusine.local/equipments/${uuid}`);
            this.detailSockets[uuid] = ws;

            ws.onmessage = async (event) => {
                const rawData = JSON.parse(event.data);

                if (rawData.event === 'ping') return;
                if (rawData.event === 'connection_established') return;
                if (rawData.event !== 'equipment_update') return;

                const eq = this.equipments.find(e => e.asset_uuid === uuid);
                if (!eq) return;
                if (!eq.history) eq.history = {};

                for (const v of rawData.variables) {
                    const key = v.id ? v.id.split('.').pop() : v.name;

                    if (!eq.history[key]) eq.history[key] = [];

                    if (!this.activeModels[key]) {
                        const path = modelsConfig[key];
                        if (path) {
                            this.activeModels[key] = await useIqrModel(path);
                        }
                    }

                    const model = this.activeModels[key];
                    let isUnusual = false;

                    if (model && key === model.getTargetValue()) {
                        const result = model.predict(v.value);
                        isUnusual = result === -1;
                    }

                    eq.variables[key] = {value: v.value, timestamp: v.timestamp};

                    eq.history[key].push({
                        x: new Date(v.timestamp).toLocaleTimeString(),
                        y: v.value,
                        isAnomalous: isUnusual
                    });

                    if (eq.history[key].length > MAX_HISTORY_SIZE) {
                        eq.history[key].shift();
                    }
                }
            };
        }
    },



});