import { defineStore } from 'pinia';

const MAX_HISTORY_SIZE = 100;

export const useEquipmentStore = defineStore('equipment', {
    state: () => ({
        equipments: [],
        mainWs: null,
        detailSockets: {},
    }),

    actions: {
        connectToEquipments() {
            this.mainWs = new WebSocket('ws://equipments-api.labusine.local/equipments');

            this.mainWs.onmessage = (event) => {
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

        subscribeToDetails(uuid) {
            if (this.detailSockets[uuid]) return;

            const ws = new WebSocket(`ws://equipments-api.labusine.local/equipments/${uuid}`);

            ws.onmessage = (event) => {
                const rawData = JSON.parse(event.data);

                if (rawData.event === 'ping') return;
                if (rawData.event === 'connection_established') return;

                const eq = this.equipments.find(e => e.asset_uuid === uuid);
                if (!eq) return;

                if (!eq.history) eq.history = {};

                if (rawData.event === 'equipment_update') {
                    rawData.variables.forEach(v => {
                        const key = v.id ? v.id.split('.').pop() : v.name;

                        if (!eq.history[key]) eq.history[key] = [];

                        eq.variables[key] = { value: v.value, timestamp: v.timestamp };

                        eq.history[key].push({
                            x: new Date(v.timestamp).toLocaleTimeString(),
                            y: v.value
                        });

                        if (eq.history[key].length > 100) {
                            eq.history[key].shift();
                        }
                    });
                }
            }
        }
    },

});