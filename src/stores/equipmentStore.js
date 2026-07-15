import { defineStore } from 'pinia';

export const useEquipmentStore = defineStore('equipment', {
    state: () => ({
        equipments: [],
        mainWs: null,
        detailSockets: {}
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

                if (rawData.event === 'ping' || rawData.event === 'connection_established') {
                    return;
                }

                const eq = this.equipments.find(e => e.asset_uuid === uuid);
                if (!eq) return;

                if (Array.isArray(rawData)) {
                    const normalizedVariables = {};
                    rawData.forEach(item => {
                        if (item.id) {
                            const key = item.id.split('.').pop();
                            normalizedVariables[key] = item.value;
                        }
                    });
                    eq.variables = { ...eq.variables, ...normalizedVariables };
                } else if (rawData.variables) {
                    eq.variables = { ...eq.variables, ...rawData.variables };
                }
            };

            this.detailSockets[uuid] = ws;
        },
    },

});