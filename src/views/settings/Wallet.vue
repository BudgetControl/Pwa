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
                                <div class="flex border border-dotted m-1" v-on:click="openModal(element.id)">
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

                </div>
            </div>
        </div>
    </section>
</template>
<script>

import HeaderButton from '@/components/Button/HeaderButton.vue';
import ApiService from '@/services/ApiService.vue';
import '@vuepic/vue-datepicker/dist/main.css'
import draggable from 'vuedraggable'

export default {
    components: {
        HeaderButton, draggable
    },
    data() {
        return {
            sortingList: [],
            showModal: false,
            wallets: [],
            color: null,
<<<<<<< HEAD
=======
            form: {
                type: ['Cash', 'Bank', 'Credit Card', 'Credit Card Revolving', 'Saving', 'Investment'],
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
>>>>>>> stable/version-2.0
        }
    },
    mounted: function () {
        this.getWallets()
    },
    methods: {
        openModal(id) {
            this.$router.push({path : `/app/settings/wallet/edit/${id}`})
        },
        getWallets() {
            ApiService.accounts().then((res) => {
                res.data.forEach(e => {
                    this.wallets.push(e)
                });
            })
        },
<<<<<<< HEAD
        saveSorting() {
            let i = 0;
            this.sortingList.forEach((e) => {
                i++;
                ApiService.setAccountSorting(e.id, i)
=======
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
                this.modal.exclude_stats = false
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
            let data = {
                name: this.modal.name,
                color: this.modal.color,
                date: this.modal.invoiceDate,
                type: this.modal.type,
                installementValue: this.modal.installment,
                currency: this.modal.currency,
                balance: this.modal.balance,
                exclude_from_stats: this.modal.exclude_stats
            }

            if(data.installementValue != null) {
                data.installement = 1
            }

            ApiService.setAccount(data, this.modal.id).then(() => {
                this.closeModal()
                this.wallets = []
                this.getWallets()
>>>>>>> stable/version-2.0
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
  