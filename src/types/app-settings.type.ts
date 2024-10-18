import { User } from './user.type';
import { Workspace, sharedWorkspace } from './workspace.type';

export interface AppSettings {
    currency_id: number;
    payment_type_id: number;
    eye_settings: boolean;
    current_ws: Workspace;
    user: User;
    workspaces: Workspace[];
    current_entry_page: number;
}