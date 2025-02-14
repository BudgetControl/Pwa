import LocalStorageCache from '../utils/local-storage-cache';

export function cacheMiddleware(config: any) {
    const cacheKey = config.url + JSON.stringify(config.params);
    const cachedResponse = LocalStorageCache.getCache(cacheKey);

    if (cachedResponse) {
        config.cachedResponse = cachedResponse;
    }

    return config;
}

export function cacheResponseMiddleware(response: any) {
    const cacheKey = response.config.url + JSON.stringify(response.config.params);
    LocalStorageCache.setCache(cacheKey, response.data);

    return response;
}