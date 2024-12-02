<template>
    <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">

        <div class="container px-4 mx-auto py-3">
            <h3 class="text-slate-400 text-sm mt-3 mb-6 font-bold uppercase">{{
                $t('labels.list_of_all_planned_entries') }} </h3>
        </div>

        <div class="container px-4 mx-auto py-3 border border-solid border-slate-100 shadow"
            v-for="(entry, i) in this.entries" :key="i">
            <div class="flex flex-wrap">
                <div class="w-full flex-1 text-xs">
                    <p class="text-xs block rounded font-bold px-4"><span class="text-emerald-500"></span>{{ entry.note
                        }}</p>
                </div>
                <div class="w-full flex-1 text-right">
                    <span class="text-sm block text-slate-700 rounded ">
                        {{ entry.amount }} <i :class="'fas fa-circle ' + entry.color_amount + ' mr-2'"></i>
                    </span>

                </div>

                <div class="flex-l">
                    <EntryActionDropdown>
                        <Action :onAction="() => deleteItem(i)" :label="$t('labels.delete')" iconClass="fa-solid fa-trash text-red-400" />
                        <Action :onAction="() => editItem(i)" :label="$t('labels.edit')" iconClass="fa-solid fa-pen-to-square" />
                    </EntryActionDropdown>
                </div>

            </div>

            <div class="flex flex-wrap">
                <div class="flex-l w-full px-4">
                    <p class="text-xs block rounded"><span class="text-emerald-500">{{
                        $t('labels.next_execution_time')}}:</span> {{ entry.date }}</p>
                    <p class="text-xs block rounded" v-if="entry.end_date"><span class="text-emerald-500">{{
                            $t('labels.end_time')}}:</span> {{ entry.end_date }}</p>
                </div>
            </div>

            <div class="flex flex-wrap">
                <div class="flex-l w-full px-4">
                    <span
                        class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1 text-emerald-600 bg-emerald-200">
                        {{ $t('labels.' + entry.planning) }}
                    </span>

                    <span v-for="(label, i) in entry.labels" v-on:click="$router.push(`/app/entries?label=${label.id}`)"
                        :key="i"
                        class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                        :style="'color: #fff; background-color: ' + label.color">{{ label.name }}</span>
                </div>
            </div>
        </div>

        <!-- pagination -->
        <div class="py-2" v-if="pagination.enabled">
            <Paginator ref="_paginator"></Paginator>
        </div>
        <!-- end pagination -->
        <ConfirmModal ref="confirmModal" />
    </div>
</template>
<script>

import EntryActionDropdown from "@/components/Dropdowns/EntryActionDropdown.vue";
import CoreService from "../../../services/core.service";
import Paginator from '../../GenericComponents/Paginator.vue';
import Action from "../../Dropdowns/Action.vue";
import ConfirmModal from "../../GenericComponents/ConfirmModal.vue";

export default {
    components: {
        EntryActionDropdown, Paginator, Action, ConfirmModal
    },
    setup() {
        const apiService = new CoreService()

        return {
            apiService
        }
    },
    data() {
        return {
            entries: [],
            pagination: {
                enabled: false
            },
        }
    },
    created() {
        window.confirm = (message) => {
            return this.$refs.confirmModal.show(message);
        };
    },
    mounted() {
        this.invoke()
    },
    methods: {
        async deleteItem(index) {
            const entryUuid = this.entries[index].id
            const userConfirmed = await window.confirm(this.$t('messages.delete_entry'));
            if (userConfirmed) {
                this.apiService.deleteEntry(entryUuid, true)
                this.deleteItemFromArray(index)
            }
    },
    deleteItemFromArray(index) {
        this.entries.splice(index, 1);
    },
    editItem(index) {
        const entryUuid = this.entries[index].id
        this.$router.push(`/app/planned_entry/${entryUuid}`)
    },
    invoke() {
        let currentPage = window.localStorage.getItem('current_page') == null ? 0 : window.localStorage.getItem('current_page')
        this.apiService.getPlannedEntry(currentPage).then((resp) => {
            resp.forEach(e => {
                const date_time = new Date(e.date_time)
                const formattedDate = date_time.toISOString().split('T')[0];

                const currency = e.currency

                let info = {
                    id: e.uuid,
                    date: formattedDate,
                    end_date: (e.end_date_time == null) ? null : e.end_date_time,
                    amount: e.amount + " " + currency.icon,
                    color_amount: e.amount <= 0 ? "text-red-500" : "text-emerald-500",
                    type_amount: e.amount <= 0 ? "expenses" : "incoming",
                    wallet: e.wallet.name,
                    note: e.note,
                    planning: e.planning,
                    planned: e.planned == 0 ? false : true,
                    category: {
                        name: e.sub_category.name,
                        id: e.sub_category.id,
                        icon: e.sub_category.category.icon,
                        slug: e.sub_category.category.slug
                    },
                    payee: null,
                    labels: []
                }

                e.labels.forEach((l) => {
                    info.labels.push(
                        {
                            id: l.id,
                            name: l.name,
                            color: l.color
                        }
                    )
                });

                this.entries.push(info)

                if (currentPage == 0) {
                    this.pagination.enabled = e.paginate
                }

                if (this.$refs._paginator !== undefined) {
                    this.$refs._paginator.hasMorePage = e.hasMorePages
                }

            });

        }).catch((error) => {
            console.error(error);
        })
    }
}

}
</script>