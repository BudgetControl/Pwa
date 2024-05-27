<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings/wallet" title="Wallet settings" />

                    <!-- modal -->
                    <div class="container px-4 mx-auto">
                        <!--content-->

                        <!-- Regular Input -->
                        <div class="mb-3 pt-0">
                            <input type="text" placeholder="Wallet name" v-model="modal.name"
                                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full" />
                        </div>

                        <div class="mb-3 pt-0">
                            <input type="text" placeholder="Balance wallet" v-model="modal.balance"
                                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full" />
                        </div>

                        <div class="mb-3 pt-0">
                            <select
                                class="w-full border-0 px-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                v-model="modal.currency">
                                <option value="0">Choose a currency</option>
                                <option v-for="(item, k) in form.currency" :key="k" :value="item.id">{{
                                    item.name }}</option>
                            </select>
                        </div>

                        <div class="mb-3 pt-0">
                            <select
                                class="w-full border-0 px-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                v-model="modal.type">
                                <option value="0">Choose a wallet type</option>
                                <option v-for="(item, k) in form.type" :key="k" :value="item">{{ item }}
                                </option>
                            </select>
                        </div>

                        <div class="mb-3 pt-0" v-if="modal.type == 'Credit Card' || modal.type == 'Credit Card Revolving'">
                            <span class="text-xs text-blueGray-400">Payment deadline</span>
                            <VueDatePicker v-model="modal.invoiceDate"></VueDatePicker>
                        </div>

                        <div class="mb-3 pt-0" v-if="modal.type == 'Credit Card' || modal.type == 'Credit Card Revolving'">
                            <span class="text-xs text-blueGray-400">Credit card installment</span>
                            <input type="text" placeholder="500.00 €" v-model="modal.installment"
                                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full" />
                        </div>

                        <div class="mb-3 pt-0">
                            <label for="exclude_stats">
                                <input v-model="modal.exclude_stats" type="checkbox" class="p-1 border rounded"
                                    id="exclude_stats" :value="true" checked> Exclude from stats
                            </label>
                        </div>

                        <div class="mb-3 pt-0">
                            <span class="text-xs text-blueGray-400">Wallet color</span>
                            <color-picker :visible-formats="['hex']" :color="modal.color" @color-change="updateColor" />
                        </div>

                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">

                        <button v-if="$route.params.id && restore === false"
                            class="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" v-on:click="archiveWallet()">
                            Archive Wallet
                        </button>

                        <button v-if="$route.params.id && restore === true"
                            class="bg-lightBlue-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" v-on:click="restoreWallet()">
                            Restore Wallet
                        </button>

                        <button
                            class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" v-on:click="saveModal()">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
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
            form: {
                type: ['Cash', 'Bank', 'Credit Card', 'Credit Card Revolving', 'Saving', 'Investment'],
                currency: []
            },
            modal: {
                id: null,
                name: null,
                color: "#c5c526",
                invoiceDate: null,
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
            if (window.confirm("Are you shure do you want archive these wallet ?")) {
                ApiService.deleteWallet(this.$route.params.id)
                alert("Wallet archived", "success")
                this.$router.push({ path: '/app/settings/wallet' })
            }
        },
        restoreWallet() {
            ApiService.restoreWallet(this.$route.params.id)
            alert("Wallet restored", "success")
            this.$router.push({ path: '/app/settings/wallet' })
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
        openModal(id) {
            if (id != null) {
                ApiService.account(id).then((resp) => {
                    this.modal.id = resp.id
                    this.modal.name = resp.name
                    this.modal.color = resp.color
                    this.modal.invoiceDate = resp.date
                    this.modal.type = resp.type
                    this.modal.currency = resp.currency
                    this.modal.exclude_stats = resp.exclude_from_stats
                    this.modal.installment = resp.installementValue
                    this.modal.balance = resp.balance
                    this.modal.deleted = resp.deleted_at

                    if (resp.deleted_at != null) {
                        this.restore = true
                    }
                })
            }
        },

        async saveModal() {
            this.validate()

            const data = {
                name: this.modal.name,
                color: this.modal.color,
                date: this.modal.invoiceDate,
                type: this.modal.type,
                installementValue: this.modal.installment,
                installment: this.installment,
                currency: this.modal.currency,
                balance: this.modal.balance,
                exclude_from_stats: this.modal.exclude_stats,
                sorting: this.modal.sorting
            }

            const _this = this

            ApiService.setAccount(data, this.modal.id).then(() => {
                alert("Wallet saved", "success")
                _this.$router.push({ path: '/app/settings/wallet' })
            })

        },
        updateColor(eventData) {
            this.modal.color = eventData.cssColor
        },
        getCurrency() {
            ApiService.currencies().then((res) => {
                res.data.forEach(e => {
                    this.form.currency.push(e)
                });
            })
        },
        saveSorting() {
            let i = 0;
            this.sortingList.forEach((e) => {
                i++;
                ApiService.setAccountSorting(e.id, i)
            })
        },
        checkMove: function (e) {
            this.sortingList = e.relatedContext.list;
        },

        validate() {
            if (this.modal.type == 0) {
                alert("Please choose a right wallet type", "error")
                return false
            }

            if (this.modal.name == null) {
                alert("Please insert a wallet name", "error")
                return false
            }

            if (this.modal.currency == 0) {
                alert("Please choose a wallet currency", "error")
                return false
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
  