import ApiService from './api.service';
import { ContactForm } from './payloads/contactForm.payload';

class NotificationService extends ApiService {

    async contactForm(data: ContactForm) {
        const response = await this.instance.post('/api/notify/email/contact', data);
        return response.data;
    }

}

export default NotificationService;