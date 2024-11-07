const DOMAIN = process.env.VUE_APP_API_PATH_V2;
import { Workspace } from '../types/workspace.type';
import { UseAuthStore } from '../storage/auth-token.store';

import axios from 'axios';

class ApiService {
    protected instance: any;
    protected tokens: { auth: { token: string, timestamp: string }, workspace: Workspace | {}, bcAuth: { token: string, timestamp: string } } = { auth: { token: '', timestamp: '' }, workspace: {}, bcAuth: { token: '', timestamp: '' } };

    constructor(value: { auth: { token: string, timestamp: string }, workspace: Workspace, bcAuth: { token: string, timestamp: string } } | boolean = false) {
        const authStorage = UseAuthStore();
        
        this.instance = axios.create({
            baseURL: DOMAIN
        });

        if (typeof value === 'object') {
            this.tokens = value;
        }

        if (value) {
            const tokens = value;

            this.instance.interceptors.request.use(
                (config: any) => {
                    if (typeof tokens === 'object' && tokens.auth) {
                        const token = tokens.auth.token;
                        const bctoken = tokens.bcAuth.token
                        config.headers['Authorization'] = `Bearer ${token}`;
                        config.headers['X-BC-Token'] = `${bctoken}`;

                        if (tokens.workspace) {
                            config.headers['X-WS'] = tokens.workspace.uuid
                        }
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
                        authStorage.set(response.headers['authorization']);
                    }
                    return response;
                },
                (error) => {
                    console.error('API Error:', error.response ? error.response.data : error.message);

                    console.warn('An error occurred during the API request. Check the console for more details.');
                    return Promise.reject(error);
                }
            );
        }
    }
}

export default ApiService;