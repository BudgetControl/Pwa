<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings" title="Label settings" />

                    <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                        <div class="px-4 py-5 flex-auto">
                            <div class="tab-content tab-space">

                                <div v-for="budget in budgets.week" :key="budget.id">
                                    <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                                        WEEK
                                    </span>

                                    <div class="relative pt-1" @click="edit(budget.id)">
                                        <div class="flex mb-2 items-center justify-between">
                                            <div>
                                                <span
                                                    class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                                                    {{ budget.budget.name }}
                                                </span>
                                            </div>
                                            <div class="text-right">
                                                <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                                                    {{ budget.difference }}{{ currency }} /
                                                </span>
                                                <span class="text-xs font-semibold inline-block text-emerald-600">
                                                    {{ budget.percentage }}%
                                                </span>
                                            </div>
                                        </div>
                                        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-emerald-200">
                                            <div :style="'width:' + budget.percentage + '%'"
                                                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500">
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div v-for="budget in budgets.month" :key="budget.id">

                                    <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                                        MONTH
                                    </span>

                                    <div class="relative pt-1" @click="edit(budget.id)">
                                        <div class="flex mb-2 items-center justify-between">
                                            <div>
                                                <span
                                                    class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                                                    {{ budget.budget.name }}
                                                </span>
                                            </div>
                                            <div class="text-right">
                                                <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                                                    {{ budget.difference }}{{ currency }} /
                                                </span>
                                                <span class="text-xs font-semibold inline-block text-emerald-600">
                                                    {{ budget.percentage }}%
                                                </span>
                                            </div>
                                        </div>
                                        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-emerald-200">
                                            <div :style="'width:' + budget.percentage + '%'"
                                                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500">
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div v-for="budget in budgets.year" :key="budget.id">
                                    <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                                        YEAR
                                    </span>

                                    <div class="relative pt-1" @click="edit(budget.id)">
                                        <div class="flex mb-2 items-center justify-between">
                                            <div>
                                                <span
                                                    class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                                                    {{ budget.budget.name }}
                                                </span>
                                            </div>
                                            <div class="text-right">
                                                <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                                                    {{ budget.difference }}{{ currency }} /
                                                </span>

                                                <span class="text-xs font-semibold inline-block text-emerald-600">
                                                    {{ budget.percentage }}%
                                                </span>
                                            </div>
                                        </div>
                                        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-emerald-200">
                                            <div :style="'width:' + budget.percentage + '%'"
                                                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <a class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    href="/app/settings/budget">
                                    Create new budget
                                </a>

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
import '@vuepic/vue-datepicker/dist/main.css'
import LocalStorageServiceVue from '../../services/LocalStorageService.vue';
import ChartServiceVue from '../../services/ChartService.vue';

export default {
    components: {
        HeaderButton
    },
    data() {
        return {
            budgets: {
                week: [],
                month: [],
                year: []
            },
            currency: '€'
        }
    },
    mounted() {
        this.init()

        try {
            const userconfig = LocalStorageServiceVue.get("user_setting")
            this.currency = userconfig.settings.currency_id
        } catch (e) {
            console.info(e)
        }

    },
    methods: {
        edit: function(id) {
            console.log(id)
        },
        init: function () {
            const _this = this
            ChartServiceVue.getBudgets().then((resp) => {
                resp.forEach((data) => {
                    switch (data.planning) {
                        case 'weekly':
                            _this.budgets.week.push(data)
                            break;
                        case 'monthly':
                            _this.budgets.month.push(data)
                            break;
                        case 'yearly':
                            _this.budgets.year.push(data)
                            break;
                    }
                })

            })

        }
    }
}
</script>

  