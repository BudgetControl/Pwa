import ApiService from './api.service';
import { ContactForm } from './payloads/contactForm.payload';

class NotificationService extends ApiService {

    async contactForm(data: ContactForm) {
        const response = await this.instance.post('/api/notify/email/contact', data);
        return response.data;
    }

    async getLastMessage() {
        const response = await this.instance.get('/api/notify/message/last');
        return response.data;
    }

    async savePushToken(firebase_token: string) {
        const response = await this.instance.post('/api/notify/save/token', { firebase_token });
        return response.data;
    }

}

export default NotificationService;