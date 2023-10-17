<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings" title="Wallet settings" />

                    <!-- wallets -->
                    <div class="container px-4 mx-auto" v-on:click="openModal(null)">
                        <div class="flex border border-dotted m-1 bg-blueGray-200">
                            <div class="flex lg:w-2/12 p-2">
                                <i class="fas fa-plus fa-lg"></i>
                            </div>
                            <div class="flex lg:w-10/12 p-2">
                                <p>
                                    Add new wallet
                                </p>
                            </div>
                        </div>
                    </div>

                    <draggable :list="wallets" group="wallet" @start="drag = true" @end="saveSorting"
                        :move="checkMove">
                        <template #item="{ element }">
                            <div class="container px-4 mx-auto ">
                                <div class="flex border border-dotted m-1">
                                    <div class="flex lg:w-2/12 p-2">
                                        <i class="fas fa-wallet fa-lg" :style="'color:' + element.color"></i>
                                    </div>
                                    <div class="flex lg:w-10/12 p-2">
                                        <p>{{ element.name }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </draggable>

                    <!-- modal -->
                    <div v-if="showModal"
                        class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex m-5">
                        <div class="relative w-auto my-6 mx-auto max-w-sm">
                            <!--content-->
                            <div
                                class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

                                <!--body-->
                                <div class="relative p-6 flex-auto">
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

                                    <div class="mb-3 pt-0"
                                        v-if="modal.type == 'Credit Card' || modal.type == 'Credit Card Revolving'">
                                        <span class="text-xs text-blueGray-400">Payment deadline</span>
                                        <VueDatePicker v-model="modal.invoiceDate"></VueDatePicker>
                                    </div>

                                    <div class="mb-3 pt-0"
                                        v-if="modal.type == 'Credit Card' || modal.type == 'Credit Card Revolving'">
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
                                        <color-picker :visible-formats="['hex']" :color="modal.color"
                                            @color-change="updateColor" />
                                    </div>

                                </div>
                                <!--footer-->
                                <div
                                    class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button" v-on:click="closeModal()">
                                        Close
                                    </button>
                                    <button
                                        class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button" v-on:click="saveModal()">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
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
import draggable from 'vuedraggable'

export default {
    components: {
        HeaderButton, VueDatePicker, ColorPicker, draggable
    },
    data() {
        return {
            sortingList: [],
            showModal: false,
            wallets: [],
            color: null,
            form: {
                type: ['Cash', 'Bank', 'Credit Card', 'Credit Card Revolving', 'Savings'],
                currency: []
            },
            modal: {
                id: null,
                name: null,
                color: null,
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
        this.getWallets()
    },
    methods: {
        getWallets() {
            ApiService.accounts().then((res) => {
                res.data.forEach(e => {
                    this.wallets.push(e)
                });
            })
        },
        handleChange() {
            console.log('changed');
        },
        inputChanged(value) {
            this.activeNames = value;
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
            this.modal.color = "#c5c526"
            if (id != null) {
                let wallets = this.wallets

                this.modal.id = wallets[id].id
                this.modal.name = wallets[id].name
                this.modal.color = wallets[id].color
                this.modal.invoiceDate = wallets[id].date
                this.modal.type = wallets[id].type
                this.modal.currency = wallets[id].currency
                this.modal.exclude_stats = wallets[id].exclude_from_stats
                this.modal.installment = wallets[id].installementValue
                this.modal.balance = wallets[id].balance
            }

            this.showModal = true

        },
        closeModal() {
            this.showModal = false

            this.modal.id = null
            this.modal.name = null
            this.modal.color = null
            this.modal.invoiceDate = null
            this.modal.type = null
            this.modal.currency = null
            this.modal.exclude_stats = false
            this.modal.installment = null
            this.modal.balance = 0
        },
        async saveModal() {
            const data = {
                name: this.modal.name,
                color: this.modal.color,
                date: this.modal.invoiceDate,
                type: this.modal.type,
                installementValue: this.modal.installment,
                currency: this.modal.currency,
                balance: this.modal.balance,
                exclude_from_stats: this.modal.exclude_stats,
                sorting: this.modal.sorting
            }

            ApiService.setAccount(data, this.modal.id).then(() => {
                this.closeModal()
                this.wallets = []
                this.getWallets()
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
  