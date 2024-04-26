<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div
                    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings/label" title="Label settings" />

                    <div class="relative p-6 flex-auto">
                        <!-- Regular Input -->
                        <div class="mb-3 pt-0">
                            <input type="text" placeholder="Workspace name" v-model="modal.name"
                                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full" />
                        </div>

                        <div class="mb-3 pt-0">
                            <label for="exclude_stats">
                                Default currency
                                <select
                                    class="w-full border-0 px-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    v-model="modal.currency">
                                    <option v-for="(item, k) in currencies" :key="k" :value="item.code">{{ item.name }}
                                    </option>
                                </select>
                            </label>
                        </div>

                        <div class="mb-3 pt-0">
                            <label for="exclude_stats">
                                Default payment type
                                <select
                                    class="w-full border-0 px-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    v-model="modal.payment_type">
                                    <option v-for="(item, k) in payment_types" :key="k" :value="item.id">{{ item.name }}
                                    </option>
                                </select>
                            </label>
                        </div>

                        <div class="mb-3 pt-0">
                            <label for="exclude_stats">
                                Share workspace with
                                <div v-for="(item, i) in sharedWith" :key="i">
                                    <span v-on:click="remove(i)"
                                        class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1">
                                        {{ item.name }}
                                        <i class="fas fa-times close-icon"></i>
                                    </span>
                                </div>
                            </label>
                        </div>

                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <button
                            class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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
import '@vuepic/vue-datepicker/dist/main.css'
import ApiServiceVue from '../../../services/ApiService.vue';
import WorkspaceService from '../../../services/WorkspaceService.vue';

export default {
    components: {
        HeaderButton
    },
    data() {
        return {
            payment_types: [],
            currencies: [],
            sharedWith: [],
            modal: {
                name: '',
                archive: false,
                shareWith: [],
                currency: 'USD',
                payment_type: 'credit_card',
            }
        }
    },
    mounted: function () {
        this.getCurrencies()
        this.getPaymentTypes()
        if (this.$route.params.id) {
            this.getWorkspaceDetail()
        }
    },
    methods: {
        saveModal() {
            console.log(this.modal)
        },
        getCurrencies() {
            ApiServiceVue.currencies().then((res) => {
                this.currencies = res.data
            })
        },
        getPaymentTypes() {
            ApiServiceVue.paymentstype().then((res) => {
                this.payment_types = res.data
            })
        },
        getWorkspaceDetail() {
            WorkspaceService.get(this.$route.params.id).then((res) => {
                this.modal.name = res.workspace.name
            })
        },
        remove(i) {
            this.sharedWith.splice(i, 1)
        }
    }
};
</script>