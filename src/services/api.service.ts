const DOMAIN = process.env.VUE_APP_API_PATH_V2;
import { useAuthStore } from '../storage/auth-token.store';
import axios from 'axios';
import { AuthToken } from '../types/auth-token.type';
import { useAppSettings } from '../storage/settings.store';
import { useCacheApi } from '../storage/cache-api';
import { useRefreshStore } from '../storage/refresh';
import { resetAllStores } from '../utils/reset-stores';
import LocalStorageCache from '../utils/local-storage-cache';
import { cacheMiddleware, cacheResponseMiddleware } from '../middleware/cache-middleware';

class ApiService {
    protected instance: any;
    protected tokens: { authToken: AuthToken, bcAuthToken: AuthToken }
    protected refreshApp = useRefreshStore();

    constructor() {
        const authStorage = useAuthStore();
        const settings = useAppSettings();
        this.tokens = authStorage

        this.instance = axios.create({
            baseURL: DOMAIN
        });
        const tokens = this.tokens;

        this.instance.interceptors.request.use(
            async (config: any) => {
                const token = authStorage.authToken.token;
                const bctoken = tokens.bcAuthToken.token;
                config.headers['Authorization'] = `Bearer ${token}`;
                config.headers['X-BC-Token'] = `${bctoken}`;

                if (settings.settings.current_ws) {
                    config.headers['X-WS'] = settings.settings.current_ws.uuid;
                }

                return cacheMiddleware(config);
            },
            (error: any) => {
                return Promise.reject(error);
            }
        );

        this.instance.interceptors.response.use(
            (response) => {
                if (response.headers && response.headers['authorization']) {
                    const bearerToken = response.headers['authorization'].replace('Bearer ', '');
                    authStorage.authToken = { token: bearerToken, timestamp: new Date().toISOString() };
                }

                cacheResponseMiddleware(response);

                return response;
            },
            (error) => {
                console.error('API Error:', error.response ? error.response.data : error.message);
                console.warn('An error occurred during the API request. Check the console for more details.');

                if (error.config && error.config.url && error.config.params) {
                    const cacheKey = error.config.url + JSON.stringify(error.config.params);
                    if (!navigator.onLine) {
                        const cachedResponse = LocalStorageCache.getCache(cacheKey);
                        if (cachedResponse) {
                            return Promise.resolve(cachedResponse);
                        }
                    }
                }

                if (error.response && error.response.status === 401) {
                    authStorage.resetState();
                    window.location.href = '/app/auth/login';
                    resetAllStores();
                }
                return Promise.reject(error);
            }
        );
    }

    protected async invoke(method: string, url: string, data: any = null, params: any = null) {
        const workspaceUuid = useAppSettings().settings.current_ws.uuid;
        const cacheKey = url + JSON.stringify(params) + workspaceUuid;
        const cachedResponse = LocalStorageCache.getCache(cacheKey);

        if (cachedResponse !== null) {
            return Promise.resolve(cachedResponse);
        }

        try {
            const response = await this.instance.request({
                method,
                url,
                data,
                params
            });
            LocalStorageCache.setCache(cacheKey, response.data);

            return response.data;
        } catch (error: any) {
            console.error('API Error:', error.response ? error.response.data : error.message);
            return Promise.reject(error.response ? error.response.data : error.message);
        }
    }

    public setInCache(response) {
        const cacheKey = response.config.url + JSON.stringify(response.config.params);
        LocalStorageCache.setCache(cacheKey, response.data);
    }
}

export default ApiService;