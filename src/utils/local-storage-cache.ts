class LocalStorageCache {
    setCache(key: string, data: any) {
        const cacheData = {
            data,
            timestamp: new Date().getTime()
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
    }

    getCache(key: string, maxAge: number = 3600000) { // default maxAge is 1 hour
        const cacheData = localStorage.getItem(key);
        if (!cacheData) {
            return null;
        }

        const parsedData = JSON.parse(cacheData);
        const currentTime = new Date().getTime();

        if (currentTime - parsedData.timestamp > maxAge) {
            localStorage.removeItem(key);
            return null;
        }

        return parsedData.data;
    }

    removeCache(key: string) {
        localStorage.removeItem(key);
    }

    clearCache() {
        localStorage.clear();
    }
}

export default new LocalStorageCache();