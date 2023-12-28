<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings/model" title="Wallet settings" />

                    <!-- modal -->
                    <div class="container px-4 mx-auto">
                        <!--content-->

                        <CardAddEntry :isModel="true" :entryId="this.$route.params.entry_id" />

                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>

import HeaderButton from '@/components/Button/HeaderButton.vue';
import ApiService from '@/services/ApiService.vue';
import '@vuepic/vue-datepicker/dist/main.css'
import CardAddEntry from '../../../components/Cards/CardAddEntry.vue';

export default {
    components: {
        HeaderButton, CardAddEntry
    },
    data() {
        return {
            sortingList: [],
            showModal: false,
            color: "#c5c526",
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
    methods: {
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
        async saveModal() {
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
                _this.$router.push({ path: '/app/settings/label' })
            })

        },
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
  