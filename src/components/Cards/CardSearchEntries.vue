<template>
    <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form>
                <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                    {{ $t('labels.search') }}
                </h6>
                <div class="flex flex-wrap">

                    <div class="w-full lg:w-6/12 px-4">
                        <div class="relative w-full mb-3">
                            <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="grid-password">
                                {{ $t('labels.search_by_text') }}
                            </label>
                            <input type="text"
                                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                v-model="action.text" />
                        </div>
                    </div>

                    <div class="w-full lg:w-6/12 px-4">
                        <div class="relative w-full mb-3">
                            <span class="block uppercase text-blueGray-600 text-xs font-bold mb-2"> {{
                                $t('labels.is_planned') }}</span>
                            <div class="container">
                                <label for="planned-no" class="uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password">
                                    {{ $t('labels.no') }}
                                    <input type="radio" id="planned-no" value="0"
                                        class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                        v-model="action.planned" />
                                </label>
                                <label for="planned-yes" class="uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password">
                                    {{ $t('labels.yes') }}
                                    <input type="radio" id="planned-yes" value="1"
                                        class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                        v-model="action.planned" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="w-full lg:w-12/12 px-4">
                        <div class="relative w-full mb-3">
                            <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="grid-password">
                                {{ $t('labels.date_interval') }}
                            </label>
                            <VueDatePicker v-model="action.date_time" :range="{ maxRange: 364 }" :options="input.month" :required=true
                                :placeholder="$t('labels.date_interval')" format="yyyy-MM-dd" />
                        </div>
                    </div>

                    <div class="w-full lg:w-6/12 px-4">
                        <div class="relative w-full mb-3">
                            <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="grid-password">
                                {{ $t('labels.type_of_transaction') }}
                            </label>
                            <select multiple
                                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                v-model="action.type">
                                <option v-for="(type, k) in input.type" :key="k" :value="type.id">{{ type.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="w-full lg:w-6/12 px-4">
                        <div class="relative w-full mb-3">
                            <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="grid-password">
                                {{ $t('labels.account') }}
                            </label>
                            <select multiple
                                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                v-model="action.account">
                                <option v-for="account in input.account" :key="account.id" :value="account.id">{{
                                    account.name
                                }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="w-full lg:w-6/12 px-4">
                        <div class="relative w-full mb-3">
                            <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="grid-password">
                                {{ $t('labels.category') }}
                            </label>
                            <select multiple
                                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                v-model="action.category">
                                <option v-for="category in input.category" :key="category.id" :value="category.id">
                                    {{ category.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="w-full lg:w-6/12 px-4">
                        <div class="relative w-full mb-3">
                            <label class="bl}ock uppercase text-blueGray-600 text-xs font-bold mb-2"
                                htmlFor="grid-password">
                                {{ $t('labels.label') }}
                            </label>
                            <select v-model="action.tags" multiple
                                class="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                                <option
                                    :class="'text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1 ' + item.color"
                                    v-for="item in input.tags" :key="item.id" :value="item.id">
                                    {{ item.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                </div>

                <hr class="mt-6 border-b-1 border-blueGray-300" />

                <div class="flex flex-wrap">
                    <div class="w-full lg:w-12/12 px-4">
                        <div class="relative w-full mb-3">
                            <button v-on:click="invoke()"
                                class="w-full bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button">
                                {{ $t('labels.search') }}
                            </button>
                        </div>
                    </div>
                </div>

                <hr class="mt-6 border-b-1 border-blueGray-300" />

            </form>
        </div>

        <div class="flex flex-wrap">
            <div class="flex-l px-4" v-if="total.entry">
                <div class="relative  mb-3">
                    incoming: <span
                        :class="'text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-emerald-600 uppercase last:mr-0 mr-1 ' + total.bgcolor">
                        {{ total.entry }} €
                    </span>

                </div>
            </div>
        </div>

        <!-- SEARCH TABLE VIEW -->

        <div class="flex flex-wrap ml-5 mr-5">
            <div class="w-full">
                <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                    <div class="px-4 py-5 flex-auto">
                        <div class="tab-content tab-space">
                            <EntriesTable ref="entryIncoming" />

                            <!-- pagination -->
                            <div class="py-2" v-if="pagination.enabled">
                                <Paginator ref="_paginator"></Paginator>
                            </div>
                            <!-- end pagination -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <AlertModal ref="alertModal" />
    </div>
</template>

<script>
import EntriesTable from "@/components/Entry/EntriesTable.vue";
import SearchService from "../../services/search.service";
import Paginator from "../GenericComponents/Paginator.vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import AlertModal from '../GenericComponents/AlertModal.vue';
import CoreService from "../../services/core.service";
import { getHeaderTokens } from "../../utils/headers-token";

export default {
    components: {
        EntriesTable, Paginator, VueDatePicker, AlertModal
    },
    setup() {
        const headers = getHeaderTokens()
        const apiService = new CoreService(headers)
        const searchService = new SearchService(headers)

        return {
            apiService, searchService
        }
    },
    data() {
        return {
            total: {
                entry: 0,
                bgcolor: "bg-emerald-400"
            },
            pagination: {
                enabled: false
            },
            input: {
                account: [],
                category: [],
                type: ["incoming", "expenses", "transfer", "debit"],
                tags: [],
            },
            action: {
                account: null,
                category: null,
                type: [],
                tags: null,
                text: null,
                planned: null,
                date_time: null
            }
        }
    },
    created() {
        window.alert = (message, type = 'success') => {
            this.$refs.alertModal.show(message, type);
        };
    },
    mounted() {
        this.getCategory()
        this.getAccount()
        this.getLabels()

        //get year frin today
        // const formattedDate = new Date().toISOString().split('T')[0] + ' 00:00:00';
        // this.action.date_time = formattedDate;

        this.input.type = [
            {
                name: this.$t('labels.incoming'),
                id: 'incoming'
            },
            {
                name: this.$t('labels.expenses'),
                id: 'expenses'
            },
            {
                name: this.$t('labels.transfer'),
                id: 'transfer'
            },
            {
                name: this.$t('labels.debit'),
                id: 'debit'
            }
        ]

    },
    methods: {
        invoke() {
            let _this = this
            let data = this.action
            let currentPage = window.localStorage.getItem('current_page') == null ? 0 : window.localStorage.getItem('current_page')

            if (this.validate() === true) {
                this.searchService.filter(data, currentPage).then((res) => {
                    _this.$refs.entryIncoming.entries = []

                    if (res.length > 0) {
                        _this.$refs.entryIncoming.buildEntriesTable(res)
                    }

                    if (currentPage == 0) {
                        this.pagination.enabled = res.paginate
                    }

                    if (this.$refs._paginator !== undefined) {
                        this.$refs._paginator.hasMorePage = res.hasMorePages
                    }

                }).catch((error) => {
                    this.action.alert = true
                    this.action.alert_message = this.$t('labels.generic_error')
                    console.log(error);
                })
            }
        },
        validate() {
            if (this.action.date_time == null) {
                alert(this.$t('messages.search.please_set_date'), 'error')
                return false
            }
            return true
        },
        getLabels() {
            let _this = this
            this.apiService.labels().then((res) => {
                let data = res
                data.forEach(function (r) {
                    _this.input.tags.push(r)
                })
            })
        },
        getCategory() {
            let _this = this
            this.apiService.subCategories().then((res) => {
                let data = res
                data.forEach(function (sub) {
                    _this.input.category.push({
                        id: sub.id,
                        name: _this.$t('app.' + sub.slug),
                    })
                })
                _this.input.category.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });

            })
        },
        getAccount() {
            let _this = this
            this.apiService.accounts('?order[name]=asc').then((res) => {
                let data = res
                data.forEach(function (r) {
                    _this.input.account.push(r)
                })
            })
        },
    }
}
</script>
