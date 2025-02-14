import ApiService from './api.service';
import { useAppSettings } from '../storage/settings.store';
import { useAuthStore } from '../storage/auth-token.store';

class AuthService extends ApiService {

    async login(email: string, password: string) {
        const response = await this.instance.post('/api/auth/authenticate', {
            email: email,
            password: password
        });

        return response.data;
    }

    async verify(email: string) {
        const response = await this.instance.post('/api/auth/verify-email', {
            email: email
        });
        return response.data;
    }

    async register(user: {
        name: string,
        email: string,
        password: string,
        confirm_password: string
    }) {
        const response = await this.instance.post('/api/auth/sign-up', {
            name: user.name,
            password: user.password,
            email: user.email,
            password_confirmation: user.confirm_password
        });
        return response.data;
    }

    async logout() {
        const response = await this.instance.get('/api/auth/logout', {
            headers: {
                'Authorization': `Bearer ${this.tokens.authToken.token}`
            }
        });
        return response.data;
    }

    async recoveryPassword(email: string) {
        const response = await this.instance.post('/api/auth/reset-password', {
            email: email,
        });
        return response.data;
    }

    async resetPassword(token: string, password: string, confirm_password: string) {
        const response = await this.instance.put(`/api/auth/reset-password/${token}`, {
            password: password,
            password_confirmation: confirm_password
        });
        return response.data;
    }

    async check() {
        //retrive access token header
        const response = await this.instance.get('/api/auth/check', {
            headers: {
                'Authorization': `Bearer ${this.tokens.authToken.token}`,
                'X-BC-Token': this.tokens.bcAuthToken.token
            }
        });

        if (response.status === 200) {
            // Accedi all'header X-Custom-Header dalla risposta
            const access_token = response.data.token;
            this.tokens.authToken.token = access_token;
        }

        return response;
    }

    async providerUri(provider: string) {
        //retrive access token header
        const response = await this.instance.get(`/api/auth/authenticate/${provider}`);

        return response.data;
    }

    async token(provider: {
        name: string,
        code: string
    }) {
        const appSettings = useAppSettings();
        //retrive access token header
        const response = await this.instance.get(`/api/auth/authenticate/token/${provider.name}?code=${provider.code}`);

        appSettings.settings.workspaces = response.data.workspaces;
        return response.data;
    }

    async confirm(token: string) {
        //retrive access token header
        const response = await this.instance.get(`/api/auth/confirm/${token}`);
        return response.status;
    }

    async deleteUser() {
        //retrive access token header
        const response = await this.instance.delete(`/api/auth/delete`);
        return response;
    }


    async deleteDataUser() {
        //retrive access token header
        const response = await this.instance.delete(`/api/auth/data/delete`);
        return response;
    }


    async settings() {
        //retrive access token header
        const response = await this.instance.get(`/api/user/settings`);
        return response.data;
    }

    async userInfo() {
        //retrive access token header
        const response = await this.instance.get('/api/auth/user-info');
        this.setUpUserInfo(response);

        return response.data;
    }

    async userInfoByEmail(email) {
        //retrive access token header
        const response = await this.instance.get(`/api/auth/user-info/by-email/${email}`, {
            headers: {
                'Authorization': `Bearer ${this.tokens.authToken.token}`,
                'X-BC-Token': this.tokens.bcAuthToken.token
            }
        });
        return response.data;
    }

    async finalizeRegistration(useruuid: string, data: { workspace: {name: string, currency: string, payment_type: string}, wallet: {name:string, balance:number, type: string, currency:number, exclude_from_stats: number, color: string} }) {

        //retrive access token header
        const response = await this.instance.post(`/api/auth/${useruuid}finalize/sign-up`, data, {
            headers: {
                'Authorization': `Bearer ${this.tokens.authToken.token}`,
            }
        });

        this.setUpUserInfo(response);

        return response.data;
    }

    /**
     * Sets up user information in the authentication store and application settings.
     *
     * @param response - The response object containing user information and authentication token.
     * @property response.data.token - The authentication token.
     * @property response.data.userInfo - The user information.
     * @property response.data.userInfo.workspace_settings - The workspace settings of the user.
     * @property response.data.userInfo.workspace_settings.data.currency - The currency setting of the workspace.
     * @property response.data.userInfo.workspace_settings.data.payment_type_id - The payment type ID setting of the workspace.
     */
    private setUpUserInfo(response) {
        const authStore = useAuthStore();
        const appSettings = useAppSettings();

        authStore.bcAuthToken = { token: response.data.token, timestamp: new Date().toISOString() };
        appSettings.settings.user = response.data.userInfo

        const workspaceSettings = response.data.userInfo.workspace_settings
        if (workspaceSettings.data) {
            appSettings.settings.currency = workspaceSettings.data.currency
            appSettings.settings.payment_type_id = workspaceSettings.data.payment_type_id
        }

    }
}

export default AuthService;