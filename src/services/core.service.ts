import ApiService from './api.service';

class CoreService extends ApiService {

    async setPlannedEntry(data, uuid) {
        let url = `/api/entry/planned`

        let response
        if (uuid !== null && uuid !== undefined) {
            url = `${url}/${uuid}`
            response = await this.instance.put(url, data);
        } else {
            response = await this.instance.post(url, data);
        }

        return response.data;
    }

    async setEntry(type, data, isPlanned, uuid) {
        let url = `/api/entry/${type}`
        if (isPlanned == true || isPlanned == 'true') {
            url = `/api/entry/planned`
        }

        let response
        if (uuid !== null && uuid !== undefined) {
            url = `${url}/${uuid}`
            response = await this.instance.put(url, data);
        } else {
            response = await this.instance.post(url, data);
        }
        // refresh app
        this.refreshApp.set(true)

        return response.data;
    }

    async getEntry(filter) {
        const response = await this.instance.get(`/api/entry${filter}`);
        return response.data;
    }

    async deleteEntry(id, isPlanned) {
        let url = `/api/entry/${id}`
        if (isPlanned == true || isPlanned == 'true') {
            url = `/api/entry/planned/${id}`
        }

        const response = await this.instance.delete(url);

        // refresh app
        this.refreshApp.set(true)
        return response.data;
    }

    async getEntryDetail(id, isPlanned) {
        let url = `/api/entry/${id}`
        if (isPlanned == true || isPlanned == 'true') {
            url = `/api/entry/planned/${id}`
        }
        const response = await this.instance.get(url);
        return response.data;
    }

    async getEntryFromAccount(id) {
        const response = await this.instance.get('/api/entry?filters[wallet_id]=' + id);
        return response.data;
    }

    async debit(page) {
        let params = ''
        if (page !== undefined) {
            params = `?page=${page}`
        }

        const response = await this.instance.get(`/api/debit${params}`);
        return response.data;
    }

    async debtsList() {
        const response = await this.instance.get(`/api/debits`);
        return response.data;
    }

    async debt() {
        const response = await this.instance.get(`/api/payees`);
        return response.data;
    }

    async deleteDebt(id) {
        const response = await this.instance.delete(`/api/debt/${id}`);
        return response.data;
    }

    async subCategories() {
        const response = await this.instance.get('/api/categories');
        return response.data

    }

    async categories() {
        const response = await this.instance.get('/api/categories-subcategories');
        this.setInCache(response)
        return response.data

    }

    async category(id) {
        const response = await this.instance.get(`/api/categories/${id}`);
        this.setInCache(response)
        return response.data;
    }

    async paymentstype() {
        const response = await this.instance.get('/api/payment-types');
        this.setInCache(response)
        return response.data;
    }

    async model() {
        const response = await this.instance.get('/api/entry/model?order[name]=asc');
        return response.data;
    }

    async getModel(id) {
        const response = await this.instance.get(`/api/entry/model/${id}`);
        return response.data;
    }

    async setModel(data, id) {
        if (id != null) {
            const response = await this.instance.put(`/api/entry/model/${id}`, data);
            return response.data;
        } else {
            const response = await this.instance.post('/api/entry/model', data);
            return response.data;
        }

    }

    async labels(queryParams) {
        if (queryParams === undefined) {
            queryParams = '?order[name]=asc';
        }

        const response = await this.instance.get(`/api/label/list${queryParams}`);
        return response.data;
    }

    async label(id) {
        const response = await this.instance.get(`/api/label/${id}`);
        return response.data;
    }

    async setLabel(id, data) {
        const response = await this.instance.put(`/api/label/${id}`, data);
        return response.data;
    }

    async currencies() {
        const response = await this.instance.get('/api/currencies');
        this.setInCache(response)
        return response.data;
    }

    async setDefaultCurrency(id) {
        const response = await this.instance.post('/api/user/currency', { currency: id });
        return response.data;
    }

    async accounts(queryParams = '') {
        const response = await this.instance.get(`/api/wallet/list${queryParams}`);
        return response.data;
    }

    async deleteWallet(uuid) {
        const response = await this.instance.delete(`/api/wallet/${uuid}`);
        return response.data;
    }

    async restoreWallet(uuid) {
        const response = await this.instance.patch(`/api/wallet/restore/${uuid}`);
        return response.data;
    }

    async account(uuid) {
        const response = await this.instance.get(`/api/wallet/show/${uuid}`);
        return response.data;
    }

    async setAccount(data, uuid) {
        if (uuid != null) {
            const response = await this.instance.put(`/api/wallet/update/${uuid}`, data);
            return response.data;
        } else {
            const response = await this.instance.post('/api/wallet/create', data);
            return response.data;
        }
    }

    async setCategories(data, id) {
        if (id != null) {
            const response = await this.instance.put(`/api/categories/${id}`, data);
            return response.data;
        } else {
            const response = await this.instance.post('/api/categories', data);
            return response.data;

        }
    }

    async setAccountSorting(uuid, sorting) {
        const response = await this.instance.patch(`/api/wallet/sorting/${uuid}`, { 'sorting': sorting });
        return response.data;
    }

    async importData(data) {
        const response = await this.instance.post('/api/entries/import', data);
        return response.data;
    }

    async getPlannedEntry(page) {
        const response = await this.instance.get(`/api/entry/planned?page=${page}`);
        return response.data;
    }

    async deleteModel(id) {
        const url = `/api/model/${id}`
        const response = await this.instance.delete(url);
        return response.data;
    }

    async assistance(data) {
        const url = `/api/mailer/assistance`
        const response = await this.instance.post(url, data);
        return response.data;
    }

    async archiveWallet(uuid) {
        const response = await this.instance.patch(`/api/wallet/archive/${uuid}`);
        return response.data;
    }
    
}

export default CoreService;