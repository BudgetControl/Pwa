<template>
    <div>
        <div class="block w-full overflow-x-auto" id="entries-table">

            <div class="container px-4 mx-auto py-3 ">
                <div class="flex items-center ps-3" v-if="isModel == false">
                    <input id="vue-checkbox-list" type="checkbox" v-model="action.show_planned" value="true"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                    <label for="vue-checkbox-list"
                        class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {{ $t("labels.show_planned_entries") }}</label>
                </div>
            </div>

            <div v-if="entries.length === 0">
                <div class="text-center">
                    <p class="text-blueGray-400 text-lg">{{ $t('labels.no_entries_found') }}</p>
                </div>
            </div>

            <div v-for="(entry, i) in entries" :key="i">
                <div v-if="(entry.planned && action.show_planned) || (!entry.planned)"
                    class="container px-4 mx-auto py-3 border border-solid border-blueGray-100 shadow" :class="[
                        entry.payee
                            ? 'bg-blueGray-200'
                            : '',
                        entry.transfer
                            ? 'transfer-color'
                            : ''
                    ]">
                    <div class="flex flex-wrap">
                        <div class="flex-l w-full px-4">
                            <span v-if="isModel == false" class="text-xs block text-emerald-500 rounded ">{{ entry.date
                                }}</span>
                            <span v-if="isModel == true" class="text-xs block uppercase font-bold rounded ">{{
                                entry.name }}</span>
                        </div>
                    </div>
                    <div class="flex">
                        <div class="w-full px-4 flex-1">
                            <i v-on:click="$router.push(`/app/entries?filter_category=${entry.category.id}`)"
                                :class="'block text-lightBlue-400 ' + entry.category.icon"> <span
                                    class="px-2 text-blueGray-700 rounded font-normal">
                                    {{ entry.category.name }} </span></i>
                            <span class="text-xs rounded"
                                :class="[entry.payee ? 'text-blueGray-900' : 'text-blueGray-400']">( {{ entry.wallet }}
                                )
                                {{
                                    entry.payee
                                }}</span>
                        </div>
                        <div class="w-full px-4 flex-1 text-right">
                            <span v-on:click="$router.push(`/app/entries?filter_type=${entry.type_amount}`)"
                                class="text-sm block text-blueGray-700 rounded amount">
                                {{ entry.amount }} <i :class="'fas fa-circle ' + entry.color_amount + ' mr-2'"></i>
                            </span>

                        </div>
                        <div class="flex-l">
                            <EntryActionDropdown :entryId="entry.uuid" :type="isModel === true
                                ? 'model'
                                : 'entry'
                                " :index=i @deleteItem="deleteItemFromArray" />
                        </div>
                    </div>

                    <div class="flex flex-wrap">
                        <div class="flex-l w-full px-4">
                            <span class="text-xs block text-blueGray-700 rounded ">{{ entry.note }}</span>
                        </div>
                    </div>

                    <div>
                        <div class="w-full px-4 flex-1">
                            <span class="text-xs mt-2 text-blueGray-700 rounded ">
                                <span v-for="(label, i) in entry.labels"
                                    v-on:click="$router.push(`/app/entries?filter_label=${label.id}`)" :key="i"
                                    class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                                    :style="'color: #fff; background-color: ' + label.color">{{
                                        label.name
                                    }}</span>
                            </span>
                        </div>

                        <div class="w-full px-4 flex-1 text-right">
                            <span class="text-xs mt-2 block text-blueGray-700 rounded ">
                                <span v-if="entry.planned == true"
                                    class="'text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1 bg-red-200">{{ $t("labels.planned_entry") }}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
import bootstrap from "@/assets/img/bootstrap.jpg";
import angular from "@/assets/img/angular.jpg";
import sketch from "@/assets/img/sketch.jpg";
import react from "@/assets/img/react.jpg";
import vue from "@/assets/img/react.jpg";
import EntryActionDropdown from "@/components/Dropdowns/EntryActionDropdown.vue";
import CoreService from "../../services/core.service";
import { getHeaderTokens } from "../../utils/headers-token";

export default {
    props: {
        showPlanned: {
            required: false,
            default: false,
            type: Boolean
        },
        isModel: {
            required: false,
            default: false,
            type: Boolean
        }
    },
    components: {
        EntryActionDropdown
    },
    setup() {
        const headers = getHeaderTokens()
        const apiService = new CoreService(headers)

        return {
            apiService
        }
    },
    data() {
        return {
            vue,
            react,
            sketch,
            angular,
            bootstrap,
            entries: [],
            filter: "",
            planned: false,
            wallet: null,
            selected: {
                wallet: 0
            },
            action: {
                reset: false,
                show_planned: true,
            },
            input: {
                tags: [],
                wallet: [],
            }
        };
    },
    methods: {
        deleteItemFromArray(index) {
            this.entries.splice(index, 1);
        },
        getwallet() {
            let _this = this

            this.apiService.wallets().then((res) => {
                let data = res
                data.forEach(function (r) {
                    _this.input.wallet.push(r)
                })
            })
        },
        buildEntriesTable(res) {
            this.entries = []

            let data = res

            let _this = this
            if (data !== undefined) {
                data.forEach(function (r) {

                    let labels = []
                    r.labels.forEach((l) => {
                        if (l.name != "") {
                            labels.push(
                                {
                                    id: l.id,
                                    name: l.name,
                                    color: l.color
                                }
                            )
                        }
                    });



                    const currency = r.currency

                    let formattedDate = null
                    if (r.date_time != null) {
                        const date_time = new Date(r.date_time)
                        formattedDate = date_time.toISOString().slice(0, 19).replace('T', ' ')
                    }

                    let info = {
                        uuid: r.uuid,
                        id: r.uuid,
                        date: formattedDate,
                        amount: parseFloat(r.amount).toFixed(2) + " " + currency.icon,
                        color_amount: r.amount <= 0 ? "text-red-500" : "text-emerald-500",
                        type_amount: r.amount <= 0 ? "expenses" : "incoming",
                        wallet: r.wallet.name,
                        note: r.note,
                        planned: r.planned == 0 || r.planned == undefined ? false : true,
                        category: {
                            id: r.sub_category.id,
                            icon: r.sub_category.category.icon,
                            name: _this.$t('app.' + r.sub_category.slug)
                        },
                        labels: labels,
                        payee: null,
                        transfer: r.type == 'transfer' ? true : false,
                        type: r.type,
                        name: r.name
                    }

                    if (r.transfer_to != null) {
                        info.wallet = r.wallet.name + " <-> " + r.transfer_to.name
                    }

                    if (r.payee != null) {
                        info.payee = "[ debit: " + r.payee.name + "]"
                    }

                    _this.entries.push(info)
                })
            }

        },

    }
};
</script>

<style scoped>
.transfer-color {
    background-color: #ffe08738;
}
</style>
