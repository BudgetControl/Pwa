import { User } from './user.type';

export interface AppSettings {
    currency_id: number;
    payment_type_id: number;
    eye_settings: boolean;
    user: User;
}