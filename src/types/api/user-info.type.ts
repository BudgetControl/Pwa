export interface UserInfo {
    token: string;
    userInfo: {
        uuid: string;
        name: boolean;
        email: string;
        email_verified_at: string | null;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
        sub: string;
        workspaces: {
            id: number;
            uuid: string;
            name: string;
            description: string;
            current: number;
            created_at: string;
            updated_at: string;
            deleted_at: string | null;
            user_id: number;
            workspace_id: number;
        }[],
        current_ws: string;
        workspace_settings: {
            id: number;
            workspace_id: number;
            setting: string;
            data: string;
            created_at: string;
            updated_at: string;
            deleted_at: string | null;
        },
        shared_with: {
            email: string;
            name: string;
        }[],
        username: string
    };
}