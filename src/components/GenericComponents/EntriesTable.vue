<template>
    <div>
        <div class="block w-full overflow-x-auto">

            <div v-for="(entry, i) in entries" :key="i">
                <div v-if="
                    ((entry.planned && showPlanned)) || 
                    ((entry.debit && showDebit)) || 
                    ((entry.transfer && showTransfer)) ||
                    (!entry.transfer) && (!entry.planned) && (!entry.debit) 
                    "
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
                            <span v-if="isModel == true" class="text-xs block uppercase font-bold rounded ">{{ entry.name }}</span>
                        </div>
                    </div>
                    <div class="flex flex-wrap">
                        <div class="w-full px-4 flex-1">
                            <i v-on:click="$router.push(`/app/entries?category=${entry.category.id}`)"
                                :class="'block text-lightBlue-400 ' + entry.category.icon"> <span
                                    class="px-2 text-blueGray-700 rounded ">
                                    {{ entry.category.name }}</span></i>
                            <span class="text-xs block rounded"
                                :class="[entry.payee ? 'text-blueGray-900' : 'text-blueGray-400']">( {{ entry.account }} )
                                {{
                                    entry.payee
                                }}</span>
                        </div>
                        <div class="w-full px-4 flex-1 text-right">
                            <span v-on:click="$router.push(`/app/entries?type=${entry.type_amount}`)"
                                class="text-sm block text-blueGray-700 rounded ">
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

                    <div class="flex flex-wrap">
                        <div class="w-full px-4 flex-1">
                            <span class="text-xs mt-2 block text-blueGray-700 rounded ">
                                <span v-for="(label, i) in entry.labels"
                                    v-on:click="$router.push(`/app/entries?label=${label.id}`)" :key="i"
                                    class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                                    :style="'color: #fff; background-color: ' + label.color">{{
                                        label.name
                                    }}</span>
                            </span>
                        </div>

                        <div class="w-full px-4 flex-1 text-right">
                            <span class="text-xs mt-2 block text-blueGray-700 rounded ">
                                <span v-if="entry.planned == true"
                                    class="'text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1 bg-red-200">PLANNED</span>
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
import ApiService from '../../services/ApiService.vue';

export default {
    props: {
        showPlanned: {
            required: false,
            default: false,
            type: Boolean
        },
        showDebit: {
            required: false,
            default: false,
            type: Boolean
        },
        showTransfer: {
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
                account: 0
            },
            action: {
                reset: false,
                show_planned: true,
            },
            input: {
                tags: [],
                account: [],
            }
        };
    },
    methods: {
        deleteItemFromArray(index) {
            this.entries.splice(index, 1);
        },
        getAccount() {
            let _this = this

            ApiService.accounts().then((res) => {
                let data = res
                data.forEach(function (r) {
                    _this.input.account.push(r)
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
                    r.label.forEach((l) => {
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

                    let info = {
                        uuid: r.uuid,
                        id: r.id,
                        date: r.date_time,
                        amount: parseFloat(r.amount).toFixed(2) + " €",
                        color_amount: r.amount <= 0 ? "text-red-500" : "text-emerald-500",
                        type_amount: r.amount <= 0 ? "expenses" : "incoming",
                        account: r.account.name,
                        note: r.note,
                        planned: r.planned == 0 ? false : true,
                        category: {
                            name: r.sub_category.name,
                            id: r.sub_category.id,
                            icon: r.sub_category.category.icon
                        },
                        labels: labels,
                        payee: null,
                        transfer: r.type == 'transfer' ? true : false,
                        type: r.type,
                        name: r.name
                    }

                    if (r.transfer_to != null) {
                        info.account = r.account.name + " <-> " + r.transfer_to.name
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
