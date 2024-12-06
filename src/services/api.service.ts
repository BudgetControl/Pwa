const DOMAIN = process.env.VUE_APP_API_PATH_V2;
import { useAuthStore } from '../storage/auth-token.store';
import axios from 'axios';
import { AuthToken } from '../types/auth-token.type';
import { useAppSettings } from '../storage/settings.store';
import { useCacheApi } from '../storage/cache-api';

class ApiService {
    protected instance: any;
    protected tokens: { authToken: AuthToken, bcAuthToken: AuthToken }

    constructor() {
        const authStorage = useAuthStore();
        const settings = useAppSettings();
        this.tokens = authStorage

        this.instance = axios.create({
            baseURL: DOMAIN
        });
        const tokens = this.tokens;

        this.instance.interceptors.request.use(
            (config: any) => {
                const token = authStorage.authToken.token;
                const bctoken = tokens.bcAuthToken.token;
                config.headers['Authorization'] = `Bearer ${token}`;
                config.headers['X-BC-Token'] = `${bctoken}`;

                if (settings.settings.current_ws) {
                    config.headers['X-WS'] = settings.settings.current_ws.uuid
                }
                return config;
            },
            (error: any) => {
                return Promise.reject(error);
            }
        );

        this.instance.interceptors.response.use(
            (response) => {
                
                //update auth token 
                if (response.headers['authorization']) {
                    const bearerToken = response.headers['authorization'].replace('Bearer ', '');
                    authStorage.authToken = { token: bearerToken, timestamp: new Date().toISOString() };
                }

                return response;
            },
            (error) => {

                const cacheKey = error.config.url+JSON.stringify(error.config.params);
                if (!navigator.onLine) {
                    const cachedResponse = useCacheApi().getCache(cacheKey);
                    if (cachedResponse) {
                        return Promise.resolve(cachedResponse);
                    }
                }
                
                console.error('API Error:', error.response ? error.response.data : error.message);
                console.warn('An error occurred during the API request. Check the console for more details.');

                //if statis on 401, logout
                if (error.response.status === 401) {
                    authStorage.resetState();
                    window.location.href = '/app/auth/login';
                }
                return Promise.reject(error);
            }
        );
    }

    public setInCache(response) {
        const cacheKey = response.config.url+JSON.stringify(response.config.params);
        useCacheApi().setCache(cacheKey, response);
    }
}

export default ApiService;