<template>
    <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">

        <div class="container px-4 mx-auto py-3">
            <h3 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">{{
                $t('labels.list_of_all_planned_entries') }} </h3>
        </div>

        <ionic-list v-for="(entry, i) in this.entries" :key="i">

            <ion-item-sliding>
                <ion-item>
                    <div class="container px-4 mx-auto py-3 border border-solid border-blueGray-100 shadow">
                        <div class="flex flex-wrap">
                            <div class="w-full flex-1 text-xs">
                                <p class="text-xs block rounded font-bold px-4"><span class="text-emerald-500"></span>{{
                                    entry.note }}</p>
                            </div>
                            <div class="w-full flex-1 text-right">
                                <span class="text-sm block text-blueGray-700 rounded ">
                                    {{ entry.amount }} <i :class="'fas fa-circle ' + entry.color_amount + ' mr-2'"></i>
                                </span>

                            </div>

                        </div>

                        <div class="flex flex-wrap">
                            <div class="flex-l w-full px-4">
                                <p class="text-xs block rounded"><span class="text-emerald-500">{{
                                    $t('labels.next_execution_time') }}:</span> {{ entry.date }}</p>
                                <p class="text-xs block rounded" v-if="entry.end_date"><span class="text-emerald-500">{{
                                    $t('labels.end_time') }}:</span> {{ entry.end_date }}</p>
                            </div>
                        </div>

                        <div class="flex flex-wrap">
                            <div class="flex-l w-full px-4">
                                <span
                                    class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1 text-emerald-600 bg-emerald-200">
                                    {{ $t('labels.' + entry.planning) }}
                                </span>

                                <span v-for="(label, i) in entry.labels"
                                    v-on:click="$router.push(`/app/entries?label=${label.id}`)" :key="i"
                                    class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                                    :style="'color: #fff; background-color: ' + label.color">{{ label.name }}</span>
                            </div>
                        </div>
                    </div>
                </ion-item>

                <ion-item-options>
                    <ion-item-option @click=editEntry(i)>{{ $t('labels.edit') }}</ion-item-option>
                    <ion-item-option @click=deleteEntry(i) color="danger">{{
                        $t('labels.delete') }}</ion-item-option>
                </ion-item-options>
            </ion-item-sliding>

        </ionic-list>

        <!-- pagination -->
        <div class="py-2" v-if="pagination.enabled">
            <Paginator ref="_paginator"></Paginator>
        </div>
        <!-- end pagination -->

    </div>
</template>
<script>

import ApiService from '../../../services/ApiService.vue';
import Paginator from '../../GenericComponents/Paginator.vue';
import { IonItemOptions, IonItemOption } from '@ionic/vue';

export default {
    components: {
        IonItemOptions,
        IonItemOption,
        Paginator
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

        deleteEntry(index) {

            const confirm = window.confirm("Are you sure you want to delete this entry?")

            if (!confirm) {
                return
            }

            this.dropdownPopoverShow = false;
            const entryId = this.entries[index].id
         
            ApiService.deleteEntry(entryId, true).then(() => {
                this.$emit('deleteItem', index)
            }).catch((error) => {
                console.error(error);
            })

            this.entries.splice(index, 1);
            const itemSliding = document.querySelector('ion-item-sliding');
            if (itemSliding) {
                itemSliding.close();
            }

        },
        /**
         * edit entry
         */
        editEntry(index) {
            const entryId = this.entries[index].id
            this.$router.push({ path: `/app/planned_entry/${entryId}` })
        },
        invoke() {

            let currentPage = window.localStorage.getItem('current_page') == null ? 0 : window.localStorage.getItem('current_page')
            ApiService.getPlannedEntry(currentPage).then((resp) => {
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