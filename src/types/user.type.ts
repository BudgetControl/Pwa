import { Workspace, WsSettings } from './workspace.type';

export interface User {
    email: string;
    uuid: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    sub: string;
    workspaces: Workspace[];
<<<<<<< HEAD
=======
    current_ws: string;
>>>>>>> a9edb61 (WIP)
    workspace_settings: WsSettings;
    shared_with: {
        email: string;
        name: string;
    }[];
}