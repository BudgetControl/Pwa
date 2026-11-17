<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold text-gray-800">Open Banking</h1>
    <p class="mt-2 text-gray-600">{{ text.intro }}</p>
    <p class="mt-1 text-sm text-gray-500">{{ text.amex }}</p>
    <AlertModal ref="alertModal" />
    <div v-if="loading" class="mt-6">{{ text.loading }}</div>
    <section v-else-if="eligible === false" class="mt-6 bg-white rounded shadow p-6">
      <h2 class="text-lg font-semibold">{{ text.contact }}</h2>
      <p class="my-3">{{ text.contactDescription }}</p>
      <form @submit.prevent="sendRequest">
        <label for="bank-request" class="block mb-2">{{ text.requestLabel }}</label>
        <textarea id="bank-request" v-model.trim="requestText" required rows="5" class="w-full bg-gray-50 rounded p-3 border"></textarea>
        <button :disabled="busy" class="mt-3 bg-emerald-600 text-white px-4 py-2 rounded">{{ text.send }}</button>
      </form>
    </section>
    <section v-else-if="eligible" class="mt-6 space-y-6">
      <div class="bg-white rounded shadow p-6">
        <h2 class="text-lg font-semibold">{{ text.connect }}</h2>
        <div class="flex flex-wrap gap-3 mt-3">
          <select v-model="bank" class="border rounded p-2" :disabled="busy">
            <option value="">{{ text.chooseBank }}</option>
            <option v-for="item in sortedBanks" :key="item.name" :value="item.name">{{ item.name }}</option>
          </select>
          <button @click="connect" :disabled="busy || !bank" class="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-50">{{ text.connect }}</button>
        </div>
      </div>
      <form v-if="connections.length" @submit.prevent="sync" class="bg-white rounded shadow p-6 space-y-4">
        <h2 class="text-lg font-semibold">{{ text.manualSync }}</h2>
        <p>{{ text.settings }}</p>
        <div class="grid md:grid-cols-2 gap-4">
          <label>{{ text.bankAccount }}
            <select v-model="selectedAccount" required class="block w-full border rounded p-2">
              <option value="">{{ text.select }}</option>
              <option v-for="account in sortedAccounts" :key="account.value" :value="account.value">{{ account.label }}</option>
            </select>
          </label>
          <label>{{ text.wallet }}<select v-model.number="form.account_id" required class="block w-full border rounded p-2"><option :value="null">{{ text.select }}</option><option v-for="item in sortedWallets" :key="item.id" :value="item.id">{{ item.name }}</option></select></label>
          <label>{{ text.category }}<select v-model.number="form.category_id" required class="block w-full border rounded p-2"><option :value="null">{{ text.select }}</option><option v-for="item in sortedCategories" :key="item.id" :value="item.id">{{ $t('app.' + item.slug) }}</option></select></label>
          <label>{{ text.incomeCategory }}<select v-model.number="form.income_category_id" required class="block w-full border rounded p-2"><option :value="null">{{ text.select }}</option><option v-for="item in sortedCategories" :key="item.id" :value="item.id">{{ $t('app.' + item.slug) }}</option></select></label>
          <label>{{ text.currency }}<select v-model.number="form.currency_id" required class="block w-full border rounded p-2"><option :value="null">{{ text.select }}</option><option v-for="item in sortedCurrencies" :key="item.id" :value="item.id">{{ $t('app.' + item.slug) }}</option></select></label>
          <label>{{ text.payment }}<select v-model.number="form.payment_type" required class="block w-full border rounded p-2"><option :value="null">{{ text.select }}</option><option v-for="item in sortedPaymentTypes" :key="item.id" :value="item.id">{{ $t('app.' + item.slug) }}</option></select></label>
          <label>{{ text.from }}<input v-model="form.date_from" required type="date" :max="today" class="block w-full border rounded p-2"></label>
        </div>
        <p class="text-sm text-gray-500">{{ text.currencyHint }}</p>
        <p class="text-sm text-gray-500">{{ text.scheduleHint }}</p>
        <button :disabled="busy" class="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-50">{{ text.sync }}</button>
      </form>
      <p v-else>{{ text.noConnections }}</p>
    </section>
  </div>
</template>
<script>
import ApiService from '../../services/api.service';
import CoreService from '../../services/core.service';
import NotificationService from '../../services/notification.service';
import { useAppSettings } from '../../storage/settings.store';
import AlertModal from '../../components/GenericComponents/AlertModal.vue';

class SyncApi extends ApiService {
  async call(action, data = {}) { return (await this.instance.post('/api/sync/' + action, data)).data; }
}
const messages = {
  it: {intro:'Collega un conto per importare i movimenti.', amex:'American Express non è disponibile in questa versione.', contact:'Contattaci', contactDescription:'Richiedi assistenza per collegare il tuo conto.', requestLabel:'Quale banca vuoi collegare?', send:'Invia richiesta', loading:'Caricamento…', connect:'Collega conto', chooseBank:'Seleziona banca', manualSync:'Sincronizzazione manuale', settings:'Scegli le categorie predefinite per i movimenti non riconosciuti.', bankAccount:'Conto bancario e scadenza consenso', wallet:'Wallet', category:'Categoria predefinita spese', incomeCategory:'Categoria predefinita entrate', model:'Modello', currency:'Valuta', payment:'Metodo di pagamento', from:'Dal giorno', select:'Seleziona', sync:'Sincronizza', noConnections:'Nessun conto collegato.', currencyHint:'Seleziona la stessa valuta del conto bancario.', scheduleHint:'Le impostazioni vengono salvate per la sincronizzazione periodica.', unknownExpiry:'Scadenza non disponibile', requested:'Richiesta inviata.', connected:'Conto collegato.', failed:'Operazione non riuscita. Controlla il collegamento e riprova.', cancelled:'Collegamento annullato. Riparti dalla selezione della banca.', result:'Importati: {imported}; già presenti: {duplicates}; non importabili: {skipped}.'},
  en: {intro:'Connect an account to import transactions.', amex:'American Express is not available in this version.', contact:'Contact us', contactDescription:'Request help connecting your bank account.', requestLabel:'Which bank would you like to connect?', send:'Send request', loading:'Loading…', connect:'Connect account', chooseBank:'Select a bank', manualSync:'Manual synchronization', settings:'Choose default categories for transactions that cannot be recognized.', bankAccount:'Bank account and consent expiry', wallet:'Wallet', category:'Default expense category', incomeCategory:'Default income category', model:'Model', currency:'Currency', payment:'Payment method', from:'From date', select:'Select', sync:'Synchronize', noConnections:'No connected accounts.', currencyHint:'Select the same currency as the bank account.', scheduleHint:'These settings are saved for scheduled synchronization.', unknownExpiry:'Expiry unavailable', requested:'Request sent.', connected:'Account connected.', failed:'The operation failed. Check the connection and try again.', cancelled:'Connection cancelled. Select the bank to start again.', result:'Imported: {imported}; already present: {duplicates}; skipped: {skipped}.'}
};
export default {
  components: { AlertModal },
  setup() { return { api: new SyncApi(), core: new CoreService(), notification: new NotificationService(), settings: useAppSettings() }; },
  data() { return { eligible:null, loading:true, busy:false, requestText:'', banks:[], connections:[], wallets:[], categories:[], currencies:[], paymentTypes:[], bank:'', selectedAccount:'', form:{account_id:null,category_id:null,income_category_id:null,currency_id:null,payment_type:null,date_from:new Date(Date.now()-30*86400000).toISOString().slice(0,10)} }; },
  computed: {
    text() { return messages[this.$i18n.locale] || messages.en; },
    today() { return new Date().toISOString().slice(0,10); },
    sortedBanks() { return this.sortBy(this.banks, item => item.name); },
    sortedWallets() { return this.sortBy(this.wallets, item => item.name); },
    sortedCategories() { return this.sortBy(this.categories, item => this.$t('app.' + item.slug)); },
    sortedCurrencies() { return this.sortBy(this.currencies, item => this.$t('app.' + item.slug)); },
    sortedPaymentTypes() { return this.sortBy(this.paymentTypes, item => this.$t('app.' + item.slug)); },
    sortedAccounts() {
      return this.sortBy(this.connections.flatMap(connection => connection.accounts.map(account => ({
        value: connection.id + ':' + account.uid,
        label: `${account.name} (${account.currency}) — ${connection.valid_until || this.text.unknownExpiry}`
      }))), item => item.label);
    }
  },
  async mounted() {
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code'); const state = query.get('state'); const error = query.get('error');
    if (code || state || error) window.history.replaceState(window.history.state, document.title, window.location.pathname);
    try {
      this.eligible = (await this.api.call('eligibility')).eligible;
      if (!this.eligible) return;
      if (error) this.$refs.alertModal.show(this.text.cancelled, 'error');
      else if (code && state) { await this.api.call('complete', {code, state}); this.$refs.alertModal.show(this.text.connected, 'success'); }
      await this.load();
    } catch (e) { this.$refs.alertModal.show(e.response?.data?.error || this.text.failed, 'error'); }
    finally { this.loading = false; }
  },
  methods: {
    sortBy(items, label) { return [...items].sort((a, b) => String(label(a) || '').localeCompare(String(label(b) || ''), this.$i18n.locale, { sensitivity: 'base' })); },
    async load() {
      const [banks, connections, wallets, categories, currencies, paymentTypes] = await Promise.all([
        this.api.call('banks'), this.api.call('connections'), this.core.accounts('?order[name]=asc&filters[archived]=false'),
        this.core.subCategories(), this.core.currencies(), this.core.paymentstype()]);
      this.banks = banks.banks; this.connections = connections.connections; this.wallets = wallets; this.categories = categories;
      this.currencies = currencies; this.paymentTypes = paymentTypes;
    },
    async connect() { this.busy = true; try { const result = await this.api.call('start', {bank:this.bank}); window.location.assign(result.url); } catch (e) { this.$refs.alertModal.show(e.response?.data?.error || this.text.failed, 'error'); this.busy = false; } },
    async sync() {
      if (!this.selectedAccount) return;
      this.busy = true;
      try {
        const [connection_id, account_uid] = this.selectedAccount.split(':');
        const result = await this.api.call('sync', {...this.form, connection_id:Number(connection_id), account_uid});
        const summary = this.text.result.replace('{imported}', result.imported).replace('{duplicates}', result.duplicates).replace('{skipped}', result.skipped);
        const balanceWarning = this.$i18n.locale === 'it'
          ? 'Sincronizzazione associata, ma il saldo bancario non è stato allineato. Riprova o controlla i log di Sync.'
          : 'Synchronization configured, but the bank balance was not aligned. Retry or check the Sync logs.';
        this.$refs.alertModal.show(result.balance_updated === false ? `${summary} ${balanceWarning}` : summary, result.balance_updated === false ? 'error' : 'success');
      } catch (e) { this.$refs.alertModal.show(e.response?.data?.error || this.text.failed, 'error'); }
      finally { this.busy = false; }
    },
    async sendRequest() {
      if (!this.requestText) return;
      this.busy = true;
      try { const user = this.settings.settings.user; await this.notification.contactForm({to:process.env.VUE_APP_SUPPORT_EMAIL || 'tech@budgetcontrol.cloud',email:user.email,user_name:user.name,subject:'Open Banking connection request',message:`Reply to: ${user.email}\n\n${this.requestText}`,privacy:true}); this.$refs.alertModal.show(this.text.requested, 'success'); this.requestText = ''; }
      catch (e) { this.$refs.alertModal.show(this.text.failed, 'error'); }
      finally { this.busy = false; }
    }
  }
};
</script>
