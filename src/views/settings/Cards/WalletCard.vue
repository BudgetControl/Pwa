<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg ">
                <div
                    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings/wallet" :title="$t('labels.wallet_settings')" />

                    <!-- modal -->
                    <div class="container px-4 mx-auto">
                        <!--content-->

                        <!-- Regular Input -->
                        <div class="mb-3 pt-0">
                            <span class="text-xs text-blueGray-400">{{ $t('labels.wallet_name') }}</span>
                            <input type="text" placeholder="Wallet name" v-model="modal.name"
                                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full" />
                        </div>

                        <div class="mb-3 pt-0">
                            <span class="text-xs text-blueGray-400">{{ $t('labels.balance_wallet') }}</span>
                            <input type="text" placeholder="1000.00" v-model="modal.balance"
                                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full" />
                        </div>

                        <div class="mb-3 pt-0">
                            <span class="text-xs text-blueGray-400">{{ $t('labels.currency') }}</span>
                            <select
                                class="w-full border-0 px-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                v-model="modal.currency">
                                <option value="0">{{ $t('labels.choose_currency') }}</option>
                                <option v-for="(item, k) in form.currency" :key="k" :value="item.id">{{
                                    item.name }}</option>
                            </select>
                        </div>

                        <div class="mb-3 pt-0">
                            <span class="text-xs text-blueGray-400">{{ $t('labels.wallet_type') }}</span>
                            <select
                                class="w-full border-0 px-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                v-model="modal.type">
                                <option value="0">{{ $t('labels.choose_wallet_type') }}</option>
                                <option v-for="(item, k) in form.type" :key="k" :value="item">{{ item }}
                                </option>
                            </select>
                        </div>

                        <div class="mb-3 pt-0"
                            v-if="modal.type == 'credit-card' || modal.type == 'credit-card-revolving'">
                            <span class="text-xs text-blueGray-400">{{ $t('labels.closing_account_statement') }}</span>
                            <VueDatePicker v-model="modal.closingAccountDate" ></VueDatePicker>
                        </div>

                        <div class="mb-3 pt-0"
                            v-if="modal.type == 'credit-card' || modal.type == 'credit-card-revolving'">
                            <span class="text-xs text-blueGray-400">{{ $t('labels.payment_deadline') }}</span>
                            <VueDatePicker v-model="modal.invoiceDate" ></VueDatePicker>
                        </div>

                        <div class="mb-3 pt-0"
                            v-if="modal.type == 'credit-card' || modal.type == 'credit-card-revolving'">
                            <span class="text-xs text-blueGray-400">{{ $t('labels.account_payment') }}</span>
                            <select v-model="modal.accountPayment" id="account" 
                                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                                <option value="-1">{{ $t('labels.choose_wallet_account') }}</option>
                                <option v-for="item in wallets" :key="item.id" :value="item.id">{{ item.name }}
                                </option>
                            </select>
                        </div>

                        <div class="mb-3 pt-0"
                            v-if="modal.type == 'credit-card-revolving'">
                            <span class="text-xs text-blueGray-400">{{ $t('labels.credit_card_installment') }}</span>
                            <input type="text" placeholder="500.00 €" v-model="modal.installment"
                                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full" />
                        </div>

                        <div class="mb-3 pt-0">
                            <label for="exclude_stats">
                                <input v-model="modal.exclude_stats" type="checkbox" class="p-1 border rounded "
                                    id="exclude_stats" :value="true" checked> <span class="text-xs text-blueGray-400">{{ $t('labels.exclude_from_stats') }}</span>
                            </label>
                        </div>

                        <div class="mb-3 pt-0">
                            <span class="text-xs text-blueGray-400">{{ $t('labels.wallet_color') }}</span>
                            <color-picker :visible-formats="['hex']" :color="modal.color" @color-change="updateColor" />
                        </div>

                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">

                        <button v-if="$route.params.id && restore === false"
                            class="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" v-on:click="archiveWallet()">
                            {{ $t('labels.archive') }}
                        </button>

                        <button v-if="$route.params.id && restore === true"
                            class="bg-lightBlue-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" v-on:click="restoreWallet()">
                            {{ $t('labels.restore') }}
                        </button>

                        <button
                            class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" v-on:click="saveModal()">
                            {{ $t('labels.save') }}
                        </button>
                    </div>
                </div>
            </div>
            <AlertModal ref="alertModal" />
        </div>
    </section>
</template>
<script>

import HeaderButton from '@/components/Button/HeaderButton.vue';
import ApiService from '@/services/ApiService.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { ColorPicker } from 'vue-accessible-color-picker';
import AlertModal from '../../../components/GenericComponents/AlertModal.vue';

export default {
    components: {
        HeaderButton, VueDatePicker, ColorPicker, AlertModal
    },
    data() {
        return {
            sortingList: [],
            showModal: false,
            color: "#c5c526",
            restore: false,
            wallets: [],
            form: {
                type: ['bank','cache', 'credit-card', 'credit-card-revolving', 'investment', 'loan', 'other', 'prepaid-card'],
                currency: []
            },
            modal: {
                id: null,
                name: null,
                color: "#c5c526",
                invoiceDate: null,
                closingAccountDate: null,
                accountPayment: '-1',
                type: [0],
                currency: [0],
                exclude_stats: false,
                installment: 0,
                balance: 0
            }
        }
    },
    mounted: function () {
        this.getCurrency()
        this.openModal(this.$route.params.id)
        this.getWallets()
    },
    created() {
        window.alert = (message, type = 'success') => {
            this.$refs.alertModal.show(message, type);
        };
    },
    methods: {
        handleChange() {
            console.log('changed');
        },
        inputChanged(value) {
            this.activeNames = value;
        },
        archiveWallet() {
            if (window.confirm(this.$t('messages.wallet.are_you_sure'))) {
                ApiService.deleteWallet(this.$route.params.id)
                alert(this.$t('messages.wallet.archived'), "success")
                this.$router.push({ path: '/app/settings/wallet' })
            }
        },
        restoreWallet() {
            ApiService.restoreWallet(this.$route.params.id)
            alert(this.$t('messages.wallet.restored'), "success")
            this.$router.push({ path: '/app/settings/wallet' })
        },
        getWallets() {
            ApiService.accounts("?filer[type]=bank").then((res) => {
                res.forEach(e => {
                    this.wallets.push(e)
                });
            })
        },
        getComponentData() {
            return {
                on: {
                    change: this.handleChange,
                    input: this.inputChanged
                },
                attrs: {
                    wrap: true
                },
                props: {
                    value: this.activeNames
                }
            };
        },
        openModal(uuid) {
            if (uuid != null) {
                ApiService.account(uuid).then((resp) => {
                    this.modal.id = resp.id
                    this.modal.name = resp.name
                    this.modal.color = resp.color
                    this.modal.invoiceDate = resp.invoice_date
                    this.modal.closingAccountDate = resp.closing_date
                    this.modal.accountPayment = resp.payment_account
                    this.modal.type = resp.type
                    this.modal.currency = resp.currency
                    this.modal.exclude_stats = resp.exclude_from_stats
                    this.modal.installment = resp.installement_value
                    this.modal.balance = resp.balance
                    this.modal.deleted = resp.deleted_at

                    if (resp.deleted_at != null) {
                        this.restore = true
                    }
                })
            }
        },

        async saveModal() {
            if (!this.validate()) {
                return
            }
            const data = {
                name: this.modal.name,
                color: this.modal.color,
                invoice_date: this.modal.invoiceDate,
                closing_date: this.modal.closingAccountDate,
                payment_account: this.modal.accountPayment,
                type: this.modal.type,
                installement_value: this.modal.installment,
                installment: this.installment,
                currency: this.modal.currency,
                balance: this.modal.balance,
                exclude_from_stats: this.modal.exclude_stats,
                sorting: this.modal.sorting
            }
            let walletUuid = null
            if(this.$route.params.id) {
                walletUuid = this.$route.params.id
            }

            ApiService.setAccount(data, walletUuid).then(() => {
                alert(this.$t('messages.wallet.saved'), "success")
            }).catch(() => {
                alert(this.$t('messages.generic_error'), "error")
            })

        },
        updateColor(eventData) {
            this.modal.color = eventData.cssColor
        },
        getCurrency() {
            ApiService.currencies().then((res) => {
                res.forEach(e => {
                    this.form.currency.push(e)
                });
            })
        },
        saveSorting() {
            let i = 0;
            this.sortingList.forEach((e) => {
                i++;
                ApiService.setAccountSorting(e.uuid, i)
            })
        },
        checkMove: function (e) {
            this.sortingList = e.relatedContext.list;
        },

        validate() {
            if (this.modal.type == 0) {
                alert(this.$t('messages.wallet.wrong_wallet'), "error")
                return false
            }

            if (this.modal.name == null) {
                alert(this.$t('messages.wallet.wallet_name'), "error")
                return false
            }

            if (this.modal.currency == 0) {
                alert(this.$t('messages.wallet.wallet_currency'), "error")
                return false
            }

            if (this.modal.type == 'credit-card' || this.modal.type == 'credit-card-revolving') {
                if (this.modal.invoiceDate == null) {
                    alert(this.$t('messages.wallet.invoice_date'), "error")
                    return false
                }

                if (this.modal.closingAccountDate == null) {
                    alert(this.$t('messages.wallet.closing_date'), "error")
                    return false
                }

                if(this.modal.accountPayment == '-1') {
                    alert(this.$t('messages.wallet.payment_account'), "error")
                    return false
                }

            }

            if (this.modal.type == 'credit-card' || this.modal.type == 'credit-card-revolving') {
                if (this.modal.installment == 0) {
                    alert(this.$t('messages.wallet.installment'), "error")
                    return false
                }
            }

            return true
        }
    }
};
</script>

<style>
.vacp-color-input-group {
    display: none !important;
}

.vacp-copy-button {
    display: none !important;
}
</style>