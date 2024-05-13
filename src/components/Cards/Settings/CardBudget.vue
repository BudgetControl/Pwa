<template>
    <div class="block w-full overflow-x-auto mt-10">
        <div class="container x-4 mx-auto py-3">

            <router-link
                class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                to="/app/budgets/new">
                Create new budget
            </router-link>

            <!--content-->
            <div class="border p-2 mt-2" v-if="budgets.week.length != 0">
                <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                    WEEK
                </span>
                <div v-for="budget in budgets.week" :key="budget.budget.uuid">
                    <router-link :to="'/app/budgets/edit/' + budget.budget.uuid" class="relative pt-1">
                        <div class="flex mb-2 items-center justify-between">
                            <div>
                                <span
                                    class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                                    {{ budget.name }}
                                </span>
                            </div>
                            <div class="text-right">
                                <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                                    ({{ budget.budget.amount }}) {{ budget.totalSpent }}{{ currency }} -
                                </span>
                                <span class="text-xs font-semibold inline-block text-emerald-600">
                                    {{ budget.budget.totalRemainingPercentage }}%
                                </span>
                            </div>
                        </div>
                        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded"
                            v-bind:class="{ 'bg-emerald-200 ': budget.percentage <= 80, 'bg-red-200': budget.percentage >= 80 }">
                             <div :style="'width:' + budget.budget.totalSpentPercentage"
                                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                                v-bind:class="{ 'bg-emerald-600 ': budget.percentage <= 80, 'bg-red-600': budget.percentage >= 80 }">
                            </div>
                        </div>

                        <div class="mb-4">
                            <span class="text-xs font-semibold inline-block text-blueGray-400">
                                {{ budget.description }}
                            </span>
                        </div>
                    </router-link>
                </div>
            </div>


            <div class="border p-2 mt-2" v-if="budgets.month.length != 0">

                <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                    MONTH
                </span>
                <div v-for="budget in budgets.month" :key="budget.budget.uuid">
                    <router-link :to="'/app/budgets/edit/' + budget.budget.uuid" class="relative pt-1">
                        <div class="flex mb-2 items-center justify-between">
                            <div>
                                <span
                                    class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                                    {{ budget.name }}
                                </span>
                            </div>
                            <div class="text-right">
                                <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                                    ({{ budget.budget.amount }}) {{ budget.totalSpent }}{{ currency }} - -
                                </span>
                                <span class="text-xs font-semibold inline-block text-emerald-600">
                                    {{ budget.budget.totalRemainingPercentage }}%
                                </span>
                            </div>
                        </div>
                        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded"
                            v-bind:class="{ 'bg-emerald-200 ': budget.percentage <= 80, 'bg-red-200': budget.percentage >= 80 }">
                             <div :style="'width:' + budget.budget.totalSpentPercentage"
                                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                                v-bind:class="{ 'bg-emerald-600 ': budget.percentage <= 80, 'bg-red-600': budget.percentage >= 80 }">
                            </div>
                        </div>

                        <div class="mb-4">
                            <span class="text-xs font-semibold inline-block text-blueGray-400">
                                {{ budget.description }}
                            </span>
                        </div>
                    </router-link>
                </div>
            </div>


            <div class="border p-2 mt-2 mb-2" v-if="budgets.year.length != 0">
                <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                    YEAR
                </span>
                <div v-for="budget in budgets.year" :key="budget.budget.uuid">
                    <router-link :to="'/app/budgets/edit/' + budget.budget.uuid" class="relative pt-1">
                        <div class="flex mb-2 items-center justify-between">
                            <div>
                                <span
                                    class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                                    {{ budget.name }}
                                </span>
                            </div>
                            <div class="text-right">
                                <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                                    ({{ budget.budget.amount }}) {{ budget.totalSpent }}{{ currency }} - -
                                </span>

                                <span class="text-xs font-semibold inline-block text-emerald-600">
                                    {{ budget.budget.totalRemainingPercentage }}%
                                </span>
                            </div>
                        </div>
                        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded"
                            v-bind:class="{ 'bg-emerald-200 ': budget.percentage <= 80, 'bg-red-200': budget.percentage >= 80 }">
                             <div :style="'width:' + budget.budget.totalSpentPercentage"
                                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                                v-bind:class="{ 'bg-emerald-600 ': budget.percentage <= 80, 'bg-red-600': budget.percentage >= 80 }">
                            </div>
                        </div>

                        <div class="mb-4">
                            <span class="text-xs font-semibold inline-block text-blueGray-400">
                                {{ budget.description }}
                            </span>
                        </div>
                    </router-link>
                </div>
            </div>

            <div class="border p-2 mt-2 mb-2" v-if="budgets.custom.length != 0">
                <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                    ONE SHOT BUDGET
                </span>
                <div v-for="budget in budgets.custom" :key="budget.budget.uuid">
                    <router-link :to="'/app/budgets/edit/' + budget.budget.uuid" class="relative pt-1">
                        <div class="flex mb-2 items-center justify-between">
                            <div>
                                <span
                                    class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                                    {{ budget.name }}
                                </span>
                            </div>
                            <div class="text-right">
                                <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                                    ({{ budget.budget.amount }}) {{ budget.totalSpent }}{{ currency }} - -
                                </span>

                                <span class="text-xs font-semibold inline-block text-emerald-600">
                                    {{ budget.budget.totalRemainingPercentage }}%
                                </span>
                            </div>
                        </div>
                        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded"
                            v-bind:class="{ 'bg-emerald-200 ': budget.percentage <= 80, 'bg-red-200': budget.percentage >= 80 }">
                             <div :style="'width:' + budget.budget.totalSpentPercentage"
                                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                                v-bind:class="{ 'bg-emerald-600 ': budget.percentage <= 80, 'bg-red-600': budget.percentage >= 80 }">
                            </div>
                        </div>

                        <div class="mb-4">
                            <span class="text-xs font-semibold inline-block text-blueGray-400">
                                {{ budget.description }}
                            </span>
                        </div>
                    </router-link>
                </div>
            </div>

        </div>
    </div>
</template>
<script>

import LocalStorageServiceVue from '../../../services/LocalStorageService.vue'
import ChartServiceVue from '../../../services/ChartService.vue'

export default {
    components: {
    },
    data() {
        return {
            budgets: {
                week: [],
                month: [],
                year: [],
                custom: []
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
        edit: function (id) {
            console.log(id)
        },
        init: function () {
            const _this = this
            ChartServiceVue.getBudgets().then((resp) => {
                resp.forEach((data) => {
                    const period = data.budget.configuration.period
                    data.percentage = data.budget.totalSpentPercentage.replace('%', '')
                    switch (period) {
                        case 'weekly':
                            _this.budgets.week.push(data)
                            break;
                        case 'monthly':
                            _this.budgets.month.push(data)
                            break;
                        case 'yearly':
                            _this.budgets.year.push(data)
                            break;
                        default:
                            _this.budgets.custom.push(data)
                            break;
                    }
                })

            })

        }
    }
}
</script>

  