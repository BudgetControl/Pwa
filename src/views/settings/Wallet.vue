<template>
    <div class="p-6 bg-gray-100 min-h-screen">
        <!-- Intestazione desktop -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">{{ $t('labels.wallet_management') }}</h1>
                <p class="text-gray-600 mt-1">{{ $t('labels.wallet_management_description') }}</p>
            </div>


        </div>

        <!-- Elenco wallet -->

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            <div class="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">

                <button @click="showAddWalletModal = true"
                    class="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center">
                    <i class="fas fa-plus mr-2"></i>{{ $t('labels.add_new_wallet') }}
                </button>

                <!-- Dropdown per filtrare wallet archiviati -->
                <select v-model="walletFilter"
                    class="border-0 px-3 py-2 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-emerald-200">
                    <option value="active">{{ $t('labels.active_wallets') }}</option>
                    <option value="all">{{ $t('labels.all_wallets') }}</option>
                    <option value="archived">{{ $t('labels.archived_wallets') }}</option>
                </select>


            </div>

            <div v-for="(wallet, index) in filteredWallets" :key="index"
                class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                :style="'border-color: ' + wallet.color + '; border-top-width: 2px; border-style: solid;'">
                <div class="p-4 border-b border-gray-200">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-semibold text-gray-800">{{ wallet.name }}</h3>
                        <div class="flex space-x-2">
                            <button @click="editWallet(wallet)" class="text-blue-500 hover:text-blue-700">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button @click="confirmDeleteWallet(wallet)" class="text-red-500 hover:text-red-700">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="mt-1 text-sm px-2 py-1 rounded inline-flex items-center"
                        :class="wallet.archived ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-800'">
                        <i :class="wallet.archived ? 'fas fa-archive mr-1' : 'fas fa-check-circle mr-1'"></i>
                        {{ wallet.archived ? $t('labels.archived') : $t('labels.active') }}
                    </div>
                </div>

                <div class="p-4 bg-gray-50">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-600 text-sm">{{ $t('labels.balance') }}</span>
                        <span class="font-semibold text-xl"
                            :class="wallet.balance >= 0 ? 'text-emerald-600' : 'text-red-600'">
                            {{ formatCurrency(wallet.balance) }}
                        </span>
                    </div>

                    <div class="text-xs text-gray-500">
                        <div class="flex justify-between">
                            <span>{{ $t('labels.last_update') }}</span>
                            <span>{{ formatDate(wallet.lastUpdate) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Card "Aggiungi wallet" per griglia vuota -->
            <div v-if="filteredWallets.length === 0" @click="showAddWalletModal = true"
                class="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 transition-colors">
                <div class="bg-emerald-100 rounded-full p-3 mb-4">
                    <i class="fas fa-plus text-emerald-500 text-xl"></i>
                </div>
                <h3 class="text-lg font-medium text-gray-800 mb-1">{{ $t('labels.add_first_wallet') }}</h3>
                <p class="text-sm text-gray-500">{{ $t('labels.click_to_create_wallet') }}</p>
            </div>
        </div>

        <!-- Modal per aggiungere/modificare wallet -->
        <div v-if="showAddWalletModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto my-8 flex flex-col">
                <!-- Header della modale -->
                <div class="bg-white p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 class="text-xl font-bold text-gray-800">
                        {{ editingWallet ? $t('labels.edit_wallet') : $t('labels.add_wallet') }}
                    </h3>
                    <button @click="closeWalletModal" class="text-gray-400 hover:text-gray-600 p-2">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>

                <!-- Contenuto della modale -->
                <div class="p-6">
                    <div class="space-y-6">
                        <!-- Nome wallet -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('labels.wallet_name') }}
                                *</label>
                            <input type="text" v-model="currentWallet.name"
                                class="w-full border-0 px-4 py-3 placeholder-slate-300 text-slate-600 bg-gray-50 rounded-lg text-sm shadow focus:outline-none focus:ring focus:ring-emerald-200"
                                :placeholder="$t('labels.wallet_name')" />
                        </div>

                        <!-- Griglia per tipo e valuta -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Tipo di wallet -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('labels.wallet_type')
                                    }}</label>
                                <select v-model="currentWallet.type"
                                    class="w-full border-0 px-4 py-3 placeholder-slate-300 text-slate-600 bg-gray-50 rounded-lg text-sm shadow focus:outline-none focus:ring focus:ring-emerald-200">
                                    <option value="bank">{{ $t('app.bank_accounts.bank') }}</option>
                                    <option value="cache">{{ $t('app.bank_accounts.cache') }}</option>
                                    <option value="credit-card">{{ $t('app.bank_accounts.credit-card') }}</option>
                                    <option value="credit-card-revolving">{{
                                        $t('app.bank_accounts.credit-card-revolving') }}</option>
                                    <option value="investment">{{ $t('app.bank_accounts.investment') }}</option>
                                    <option value="loan">{{ $t('app.bank_accounts.loan') }}</option>
                                    <option value="prepaid-card">{{ $t('app.bank_accounts.prepaid-card') }}</option>
                                    <option value="voucher">{{ $t('app.bank_accounts.voucher') }}</option>
                                    <option value="other">{{ $t('app.bank_accounts.other') }}</option>
                                </select>
                            </div>

                            <!-- Valuta -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('labels.currency')
                                    }}</label>
                                <CurrencySelector v-model="currentWallet.currency" :currencies="availableCurrencies"
                                    :required="true" />
                            </div>
                        </div>

                        <!-- Campi specifici per carte di credito -->
                        <div v-if="currentWallet.type === 'credit-card' || currentWallet.type === 'credit-card-revolving'"
                            class="bg-blue-50 rounded-lg space-y-6">
                            <h4 class="text-lg font-semibold text-blue-800 mb-4">{{ $t('labels.credit_card_settings') }}
                            </h4>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">{{
                                        $t('labels.closing_account_statement') }}</label>
                                    <VueDatePicker v-model="currentWallet.closingAccountDate" />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">{{
                                        $t('labels.payment_deadline') }}</label>
                                    <VueDatePicker v-model="currentWallet.invoiceDate" />
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">{{
                                    $t('labels.account_payment') }}</label>
                                <select v-model="currentWallet.accountPayment"
                                    class="w-full border-0 px-4 py-3 placeholder-slate-300 text-slate-600 bg-gray-50 rounded-lg text-sm shadow focus:outline-none focus:ring focus:ring-emerald-200">
                                    <option value="-1">{{ $t('labels.choose_wallet_account') }}</option>
                                    <option v-for="wallet in paymentWallets" :key="wallet.id" :value="wallet.id">
                                        {{ wallet.name }}
                                    </option>
                                </select>
                            </div>

                            <!-- Campo specifico per carte revolving -->
                            <div v-if="currentWallet.type === 'credit-card-revolving'">
                                <label class="block text-sm font-medium text-gray-700 mb-2">{{
                                    $t('labels.credit_card_installement') }}</label>
                                <input type="number" v-model="currentWallet.installement_value"
                                    class="w-full border-0 px-4 py-3 placeholder-slate-300 text-slate-600 bg-gray-50 rounded-lg text-sm shadow focus:outline-none focus:ring focus:ring-emerald-200"
                                    placeholder="500.00" step="0.01" />
                            </div>
                        </div>

                        <!-- Campo specifico per voucher -->
                        <div v-if="currentWallet.type === 'voucher'" class="bg-purple-50 mt-5 rounded-lg">
                            <h4 class="text-lg font-semibold text-purple-800 mb-4">{{ $t('labels.voucher_settings') }}
                            </h4>
                            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('labels.ticket_value')
                                }}</label>
                            <input type="number" v-model="currentWallet.voucher_value"
                                class="w-full border-0 px-4 py-3 placeholder-slate-300 text-slate-600 bg-gray-50 rounded-lg text-sm shadow focus:outline-none focus:ring focus:ring-emerald-200"
                                placeholder="10.00" step="0.01" />
                        </div>

                        <!-- Colore e saldo -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Colore wallet -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('labels.wallet_color')
                                    }}</label>
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 rounded-full border-2 border-gray-300 shadow-sm"
                                        :style="{ backgroundColor: currentWallet.color }"></div>
                                    <input type="color" v-model="currentWallet.color"
                                        class="w-20 h-12 border-0 rounded-lg cursor-pointer shadow-sm" />
                                </div>
                            </div>

                            <!-- Saldo iniziale -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    {{ editingWallet ? $t('labels.balance_wallet') : $t('labels.initial_balance') }}
                                    <span v-if="currentWallet.type === 'voucher' && voucherBalanceDisplay"
                                        class="text-xs text-gray-500 block">
                                        ({{ voucherBalanceDisplay }})
                                    </span>
                                </label>
                                <input type="number" v-model="currentWallet.balance"
                                    class="w-full border-0 px-4 py-3 placeholder-slate-300 text-slate-600 bg-gray-50 rounded-lg text-sm shadow focus:outline-none focus:ring focus:ring-emerald-200"
                                    :placeholder="editingWallet ? '0' : $t('labels.enter_initial_balance')"
                                    step="0.01" />
                            </div>
                        </div>

                        <!-- Checkbox options -->
                        <div class="bg-gray-50 mt-6 rounded-lg space-y-4">
                            <h4 class="text-sm font-semibold text-gray-700 mb-3">{{ $t('labels.additional_options') }}
                            </h4>
                            <div class="space-y-3">
                                <div class="flex items-center">
                                    <input type="checkbox" id="exclude_stats" v-model="currentWallet.exclude_stats"
                                        class="h-4 w-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 mr-3" />
                                    <label for="exclude_stats" class="text-sm text-gray-700">{{
                                        $t('labels.exclude_from_stats') }}</label>
                                </div>

                                <div class="flex items-center">
                                    <input type="checkbox" id="archived" v-model="currentWallet.archived"
                                        class="h-4 w-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 mr-3" />
                                    <label for="archived" class="text-sm text-gray-700">{{ $t('labels.archived')
                                        }}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer della modale -->
                <div class="bg-white p-6 border-t border-gray-200">
                    <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                        <button @click="saveWallet"
                            class="flex-1 bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-medium">
                            {{ $t('labels.save') }}
                        </button>
                        <button @click="closeWalletModal"
                            class="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                            {{ $t('labels.cancel') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal di conferma eliminazione -->
        <div v-if="showDeleteConfirmation"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4">{{ $t('labels.confirm_deletion') }}</h3>
                <p class="text-gray-600 mb-6">
                    {{ $t('messages.wallet_delete_confirmation', { name: walletToDelete?.name || '' }) }}
                </p>

                <div class="flex space-x-3">
                    <button @click="deleteWallet"
                        class="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                        {{ $t('labels.delete') }}
                    </button>
                    <button @click="showDeleteConfirmation = false"
                        class="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        {{ $t('labels.cancel') }}
                    </button>
                </div>
            </div>
        </div>
        <AlertModal ref="alertModal" />
    </div>
</template>

<script>
import CoreService from '../../services/core.service';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import CurrencySelector from '../../components/Input/CurrencySelector.vue';
import AlertModal from '../../components/GenericComponents/AlertModal.vue';

export default {
    components: {
        VueDatePicker,
        CurrencySelector,
        AlertModal
    },
    setup() {
        const apiService = new CoreService();
        return { apiService };
    },
    data() {
        return {
            wallets: [],
            walletFilter: 'active',
            showAddWalletModal: false,
            showDeleteConfirmation: false,
            walletToDelete: null,
            editingWallet: false,
            availableCurrencies: [],
            currentWallet: {
                id: null,
                name: '',
                type: 'bank',
                balance: 0,
                currency_id: 1,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                archived: false,
                exclude_stats: false,
                invoiceDate: null,
                closingAccountDate: null,
                accountPayment: '-1',
                installement_value: null,
                voucher_value: null,
                lastUpdate: new Date()
            }
        };
    },
    created() {
        window.alert = (message, type = 'success') => {
            this.$refs.alertModal.show(message, type);
        };
    },
    computed: {
        filteredWallets() {
            switch (this.walletFilter) {
                case 'active':
                    return this.wallets.filter(wallet => !wallet.archived);
                case 'archived':
                    return this.wallets.filter(wallet => wallet.archived);
                case 'all':
                default:
                    return this.wallets;
            }
        },
        paymentWallets() {
            // Filtra i wallet che possono essere usati come conto di pagamento (escludi carte di credito)
            return this.wallets.filter(wallet =>
                !['credit-card', 'credit-card-revolving'].includes(wallet.type) &&
                !wallet.archived
            );
        },
        voucherBalanceDisplay() {
            if (this.currentWallet.type === 'voucher' && this.currentWallet.voucher_value && this.currentWallet.balance) {
                const voucherBalance = this.currentWallet.balance * this.currentWallet.voucher_value;
                return `${voucherBalance.toFixed(2)} €`;
            }
            return null;
        }
    },
    mounted() {
        this.loadWallets();
        this.loadCurrencies();
    },
    methods: {
        loadWallets() {
            this.apiService.accounts('?order[name]=asc').then((res) => {
                const getWalletBalance = function (wallet) {
                    let balance = wallet.balance
                    if (wallet.type == "voucher") {
                        balance = wallet.balance.value_in_valut
                    }
                    return balance
                }

                this.wallets = res.map(wallet => ({
                    id: wallet.id,
                    name: wallet.name,
                    balance: getWalletBalance(wallet),
                    currency: wallet.currency,
                    archived: wallet.archived || false,
                    lastUpdate: wallet.updated_at || new Date(),
                    color: wallet.color || '#' + Math.floor(Math.random() * 16777215).toString(16),
                    type: wallet.type || 'bank',
                    exclude_stats: wallet.exclude_stats || false,
                    invoiceDate: wallet.invoice_date || null,
                    closingAccountDate: wallet.closing_account_date || null,
                    accountPayment: wallet.payment_account || '-1',
                    installement_value: wallet.installement_value || null,
                    voucher_value: wallet.voucher_value || null,
                    uuid: wallet.uuid || null
                }));
            });
        },

        loadCurrencies() {
            this.apiService.currencies().then((res) => {
                this.availableCurrencies = res;
            });
        },

        formatCurrency(amount) {
            return new Intl.NumberFormat('it-IT', {
                style: 'currency',
                currency: 'EUR'
            }).format(amount);
        },

        formatDate(date) {
            return new Date(date).toLocaleDateString();
        },

        editWallet(wallet) {
            this.editingWallet = true;
            console.debug('Editing wallet:', wallet);
            this.currentWallet = {
                ...wallet,
                type: wallet.type || 'bank',
                color: wallet.color || '#' + Math.floor(Math.random() * 16777215).toString(16),
                exclude_stats: wallet.exclude_stats || false,
                currency_id: wallet.currency_id || 1
            };
            this.showAddWalletModal = true;
        },

        confirmDeleteWallet(wallet) {
            this.walletToDelete = wallet;
            this.showDeleteConfirmation = true;
        },

        deleteWallet() {
            if (this.walletToDelete) {
                this.apiService.deleteAccount(this.walletToDelete.id).then(() => {
                    this.wallets = this.wallets.filter(w => w.id !== this.walletToDelete.id);
                    this.showDeleteConfirmation = false;
                    this.walletToDelete = null;
                    alert(this.$t('messages.wallet_deleted'), 'success');
                }).catch(() => {
                    alert(this.$t('messages.wallet_delete_error'), 'error');
                });
            }
        },

        saveWallet() {
            if (!this.validateWallet()) {
                return;
            }

            const walletData = {
                name: this.currentWallet.name,
                type: this.currentWallet.type,
                balance: this.currentWallet.balance || 0,
                currency_id: this.currentWallet.currency_id,
                color: this.currentWallet.color,
                archived: this.currentWallet.archived,
                exclude_stats: this.currentWallet.exclude_stats,
                invoice_date: this.currentWallet.invoiceDate,
                closing_date: this.currentWallet.closingAccountDate,
                payment_account: this.currentWallet.accountPayment !== '-1' ? this.currentWallet.accountPayment : null,
                installement_value: this.currentWallet.installement_value,
                voucher_value: this.currentWallet.voucher_value
            };

            const walletUuid = this.editingWallet ? this.currentWallet.uuid : null;

            this.apiService.setAccount(walletData, walletUuid).then(() => {
                this.loadWallets();
                this.closeWalletModal();
                alert(this.editingWallet ? this.$t('messages.wallet.saved') : this.$t('messages.wallet.saved'), 'success');
            }).catch(() => {
                alert(this.$t('messages.generic_error'), 'error');
            });
        },

        validateWallet() {
            if (!this.currentWallet.name) {
                alert(this.$t('messages.wallet_name_required'), 'error');
                return false;
            }

            if (this.currentWallet.type === 'credit-card' || this.currentWallet.type === 'credit-card-revolving') {
                if (!this.currentWallet.invoiceDate) {
                    alert(this.$t('messages.wallet.invoice_date'), 'error');
                    return false;
                }
                if (!this.currentWallet.closingAccountDate) {
                    alert(this.$t('messages.wallet.closing_date'), 'error');
                    return false;
                }
                if (this.currentWallet.accountPayment === '-1') {
                    alert(this.$t('messages.wallet.payment_account'), 'error');
                    return false;
                }
            }

            if (this.currentWallet.type === 'voucher' && !this.currentWallet.voucher_value) {
                alert(this.$t('messages.wallet.voucher_value'), 'error');
                return false;
            }

            return true;
        },

        closeWalletModal() {
            this.showAddWalletModal = false;
            this.editingWallet = false;
            this.currentWallet = {
                id: null,
                name: '',
                type: 'bank',
                balance: 0,
                currency_id: 1,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                archived: false,
                exclude_stats: false,
                invoiceDate: null,
                closingAccountDate: null,
                accountPayment: '-1',
                installement_value: null,
                voucher_value: null,
                lastUpdate: new Date()
            };
        },
    }
}
</script>