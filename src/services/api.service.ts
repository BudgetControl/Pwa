const DOMAIN = process.env.VUE_APP_API_PATH_V2;
import LocalStorageService from '../utils/local-storage';
import axios from 'axios';

class ApiService {
    protected instance: any;

    constructor(auth: boolean = false) {
        this.instance = axios.create({
            baseURL: DOMAIN
        });

        if (auth === true) {
            this.instance.interceptors.request.use(
                (config: any) => {
                    const token = LocalStorageService.getToken()
                    const bctoken = LocalStorageService.getUserToken()
                    config.headers['Authorization'] = `Bearer ${token}`;
                    config.headers['X-BC-Token'] = `${bctoken}`;

                    if (LocalStorageService.getWorkspaceId()) {
                        config.headers['X-BC-WS'] = LocalStorageService.getWorkspaceId()
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