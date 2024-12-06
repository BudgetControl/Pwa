import { defineStore } from 'pinia'

const STORE_NAME = 'cache-api'

export const useCacheApi = defineStore(STORE_NAME, {
    state: () => ({
        cache: {} as Record<string, any>,
    }),
    actions: {
        resetState() {
            this.$reset();
        },
        setCache(key: string, data: any) {
            this.cache[key] = {
                data,
                timestamp: new Date().getTime(),
            };
        },
        getCache(key: string) {
            const cached = this.cache[key];
            if (cached) {
                const now = new Date().getTime();
                const age = (now - cached.timestamp) / 1000; // in seconds
                if (age < 300) { // cache valid for 5 minutes
                    return cached.data;
                } else {
                    delete this.cache[key];
                }
            }
            return null;
        },
    },
    persist: false,
});