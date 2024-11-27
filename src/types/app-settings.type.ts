import { User } from './user.type';
import { Workspace, sharedWorkspace } from './workspace.type';

export interface AppSettings {
    currency: {
        id: number;
        name: string;
        symbol: string;
    };
    payment_type_id: number;
    eye_settings: boolean;
    current_ws: Workspace;
    user: User;
    workspaces: Workspace[];
    current_page: number;
}