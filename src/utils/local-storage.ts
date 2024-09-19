import { UserInfo } from "../models/api/user-info.model";
import { AuthToken } from "../models/auth-token.model";

class LocalStorage {

    public check(name: string): boolean {
        const storage = localStorage.getItem(name)
        if (storage === null) {
            return false
        }

        return true
    }

    public getToken(): string | null {
        const token = localStorage.getItem('auth-token')
        if (token === null) {
            return null
        }

        return token
    }

    public setToken(value: string) {
        localStorage.setItem('auth-token', btoa(value))
    }

    public setUser(value: UserInfo) {
        this.set('user', value)
        this.set('settings', JSON.parse(value.userInfo.workspace_settings.data))
    }

    public setUserToken(value: string) {
        localStorage.setItem('user-token', value)
    }

    public getUserToken(): string | null {
        return localStorage.getItem('user-token')
    }

    public getUser(): UserInfo | null {
        return this.get('user')
    }

    public set(name: string, value: any) {
        if (this.check('auth-token') === true) {
            localStorage.setItem(name, btoa(encodeURI(JSON.stringify(value))))
        }
    }

    public getWorkspaceId(): string | null {
        return localStorage.getItem('workspace-id')
    }

    public setWorkspaceId(value: string) {
        localStorage.setItem('workspace-id', value)
    }

    public get(name: string): UserInfo | null {
        const storage = localStorage.getItem(name)
        if (storage === null) {
            return null
        }

        return JSON.parse(decodeURI(atob(storage)))
    }

    public clear() {
        this.deleteItem('auth-token')
        this.deleteItem('user')
        this.deleteItem('user-token')
        this.deleteItem('current_page')
        this.deleteItem('settings')
        this.deleteItem('workspace')
    }

    public deleteItem(name: string) {
        return localStorage.removeItem(name)
    }

}

export default new LocalStorage();