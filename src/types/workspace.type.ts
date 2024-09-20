export interface Workspace {
    name: string
    uuid: string
    created_at: string
    updated_at: string
    description: string
    deleted_at: string | null
    user_id: number
    workspace_id: number
}

export interface WsConfiguration {
    
}

export interface WsSettings {
    id: number
    workspace_id: number
    setting: string
    data: { currency_id: number, payment_type_id: number }
    created_at: string
    updated_at: string
    deleted_at: string | null
}