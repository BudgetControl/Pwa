export interface Auth {
    success: boolean,
    message: string,
    refresh_token: string,
    id_token: string,
    token: string,
    workspaces: Workspace[]
}

export interface Workspace {
    id: number,
    uuid: string,
    name: string,
    description: string,
    current: boolean,
    created_at: string,
    updated_at: string,
    deleted_at: string | null,
    user_id: number
}