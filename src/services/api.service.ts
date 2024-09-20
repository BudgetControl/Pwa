const DOMAIN = process.env.VUE_APP_API_PATH_V2;
import { getHeaderTokens } from '../utils/headers-token';
import axios from 'axios';

class ApiService {
    protected instance: any;

    constructor(auth: boolean = false) {
        this.instance = axios.create({
            baseURL: DOMAIN
        });

        const tokens = getHeaderTokens();

        if (auth === true) {
            this.instance.interceptors.request.use(
                (config: any) => {
                    const token = tokens.auth.token;
                    const bctoken = tokens.bcAuth.token
                    config.headers['Authorization'] = `Bearer ${token}`;
                    config.headers['X-BC-Token'] = `${bctoken}`;

                    if (tokens.workspace.uuid) {
                        config.headers['X-BC-WS'] = tokens.workspace.uuid
                    }
                    return config;
                },
                (error: any) => {
                    return Promise.reject(error);
                }
            );
        }
    }
}

export default ApiService;