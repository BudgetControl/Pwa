import ApiService from './api.service';
import {useAppSettings } from '../storage/settings.store';
import Auth from '../layouts/Auth.vue';

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
                'Authorization': `Bearer ${this.tokens.auth.token}`
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
                'Authorization': `Bearer ${this.tokens.auth.token}`,
                'X-BC-Token': this.tokens.bcAuth.token
            }
        });

        if (response.status === 200) {
            // Accedi all'header X-Custom-Header dalla risposta
            const access_token = response.data.token;
            this.tokens.auth.token = access_token;
        }

        return response;
    }

    async providerUri(provider: string) {
        //retrive access token header
        const response = await this.instance.get(`/api/auth/authenticate/${provider}`);

        return response.data;
    }

    async token(provider: {
        provider: string,
        code: string
    }) {
        //retrive access token header
        const response = await this.instance.get(`/api/auth/authenticate/token/${provider}?code=${provider.code}`);

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
        const user = useAppSettings();
        //retrive access token header
        const response = await this.instance.get('/api/auth/user-info');

        this.tokens.bcAuth.token = response.data.token;
        user.settings.user = response.data.userInfo;

        return response.data;
    }

    async userInfoByEmail(email) {
        const user = useAppSettings();

        //retrive access token header
        const response = await this.instance.get(`/api/auth/user-info/by-email/${email}`, {
            headers: {
                'Authorization': `Bearer ${this.tokens.auth.token}`,
                'X-BC-Token': this.tokens.bcAuth.token
            }
        });
        return response.data;
    }
}

export default AuthService;