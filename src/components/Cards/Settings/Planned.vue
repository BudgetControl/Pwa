<template>
    <div class="block w-full overflow-x-auto mt-10">

        <div class="container x-4 mx-auto py-3">
            <router-link to="/app/add_entry?planned=true" v-slot="{ href, navigate, isActive }">
                <a :href="href" @click="navigate"
                    class="px-3 py-2 items-center text-xs bg-emerald-600 uppercase font-bold leading-snug text-white hover:opacity-75"
                    :class="[
                        isActive
                            ? 'text-white hover:text-emerald-600'
                            : 'text-white hover:text-white',
                    ]">
                    Add new Entry
                </a>
            </router-link>
        </div>

        <div class="container px-4 mx-auto py-3 border border-solid border-blueGray-100 shadow"
            v-for="(entry, i) in this.entries" :key="i">
            <div class="flex flex-wrap">
                <div class="flex-l w-full px-4">
                    <span class="text-xs block text-emerald-500 rounded ">{{ entry.date }} {{ entry.end_date }}</span>
                </div>
            </div>
            <div class="flex flex-wrap">
                <div class="w-full px-4 flex-1">
                    <i :class="'block text-lightBlue-400 ' + entry.category.icon"> <span
                            class="px-2 text-blueGray-700 rounded ">
                            {{ entry.category.name }}</span></i>
                    <span class="text-xs block rounded" :class="[entry.payee ? 'text-blueGray-900' : 'text-blueGray-400']">(
                        {{ entry.account }} )
                        {{
                            entry.payee
                        }}</span>
                </div>
                <div class="w-full px-4 flex-1 text-right">
                    <span class="text-sm block text-blueGray-700 rounded ">
                        {{ entry.amount }} <i :class="'fas fa-circle ' + entry.color_amount + ' mr-2'"></i>
                    </span>

                </div>

                <div class="flex-l">
                    <EntryActionDropdown :entryId="entry.id" queryParams="planned=true" />
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

                    </span>
                </div>

                <div class="w-full px-4 flex-1 text-right">

                </div>

            </div>
        </div>

        <!-- pagination -->
        <div class="py-2" v-if="pagination.enabled">
            <Paginator ref="_paginator"></Paginator>
        </div>
        <!-- end pagination -->

    </div>
</template>
<script>

import EntryActionDropdown from "@/components/Dropdowns/EntryActionDropdown.vue";
import ApiServiceVue from '../../../services/ApiService.vue';
import Paginator from '../../GenericComponents/Paginator.vue';

export default {
    components: {
        EntryActionDropdown, Paginator
    },
    data() {
        return {
            entries: [],
            pagination: {
                enabled: false
            },
        }
    },
    mounted() {
        this.invoke()
    },
    methods: {
        invoke() {

            let currentPage = window.localStorage.getItem('current_page') == null ? 0 : window.localStorage.getItem('current_page')
            ApiServiceVue.getPlannedEntry(currentPage).then((resp) => {
                resp.data.forEach(e => {
                    let info = {
                        id: e.uuid,
                        date: `Start: ${e.date_time}`,
                        end_date: (e.end_date_time == null) ? null : `End: ${e.end_date_time}`,
                        amount: e.amount.toFixed(2) + " €",
                        color_amount: e.amount <= 0 ? "text-red-500" : "text-emerald-500",
                        type_amount: e.amount <= 0 ? "expenses" : "incoming",
                        account: e.account.name,
                        note: e.note,
                        planned: e.planned == 0 ? false : true,
                        category: {
                            name: e.sub_category.name,
                            id: e.sub_category.id,
                            icon: e.sub_category.category.icon
                        },
                        payee: null,
                    }

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