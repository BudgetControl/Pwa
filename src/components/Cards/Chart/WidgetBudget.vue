<template>
    <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div class="px-4 py-5 flex-auto">
            <div class="tab-content tab-space">

                <div class="border p-2 mt-2" v-if="budgets.week.length != 0">
                    <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                        WEEK
                    </span>

                    <div class="relative pt-1" v-for="budget in budgets.week" :key="budget.id">
                        <div class="flex mb-2 items-center justify-between">
                            <div>
                                <span
                                    class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                                    {{ budget.config.name }}
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
                        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded" v-bind:class="{ 'bg-emerald-200 ': budget.percentage <= 80, 'bg-red-200': budget.percentage >= 80 }" >
                            <div :style="'width:' + budget.percentage + '%'"
                                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center" 
                                v-bind:class="{ 'bg-emerald-600 ': budget.percentage <= 80, 'bg-red-600': budget.percentage >= 80 }" >
                            </div>
                        </div>

                        <div class="mb-4">
                            <span class="text-xs font-semibold inline-block text-blueGray-400">
                                {{ budget.config.note }}
                            </span>
                        </div>
                    </div>
                </div>


                <div class="border p-2 mt-2" v-if="budgets.month.length != 0">

                    <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                        MONTH
                    </span>

                    <div class="relative pt-1"  v-for="budget in budgets.month" :key="budget.id">
                        <div class="flex mb-2 items-center justify-between">
                            <div>
                                <span
                                    class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                                    {{ budget.config.name }}
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
                        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded " v-bind:class="{ 'bg-emerald-200 ': budget.percentage <= 80, 'bg-red-200': budget.percentage >= 80 }" >
                            <div :style="'width:' + budget.percentage + '%'"
                                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                                v-bind:class="{ 'bg-emerald-600 ': budget.percentage <= 80, 'bg-red-600': budget.percentage >= 80 }" >
                            </div>
                        </div>

                        <div class="mb-4">
                            <span class="text-xs font-semibold inline-block text-blueGray-400">
                                {{ budget.config.note }}
                            </span>
                        </div>
                    </div>
                </div>


                <div class="border p-2 mt-2 mb-2" v-if="budgets.year.length != 0">
                    <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                        YEAR
                    </span>

                    <div class="relative pt-1" v-for="budget in budgets.year" :key="budget.id">
                        <div class="flex mb-2 items-center justify-between">
                            <div>
                                <span
                                    class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                                    {{ budget.config.name }}
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
                        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded" v-bind:class="{ 'bg-emerald-200 ': budget.percentage <= 80, 'bg-red-200': budget.percentage >= 80 }" >
                            <div :style="'width:' + budget.percentage + '%'"
                                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                                v-bind:class="{ 'bg-emerald-600 ': budget.percentage <= 80, 'bg-red-600': budget.percentage >= 80 }" >
                            </div>
                        </div>

                        <div class="mb-4">
                            <span class="text-xs font-semibold inline-block text-blueGray-400">
                                {{ budget.config.note }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="border p-2 mt-2 mb-2" v-if="budgets.custom.length != 0">
                    <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                        YEAR
                    </span>

                    <div class="relative pt-1" v-for="budget in budgets.custom" :key="budget.id">
                        <div class="flex mb-2 items-center justify-between">
                            <div>
                                <span
                                    class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                                    {{ budget.config.name }}
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
                        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded" v-bind:class="{ 'bg-emerald-200 ': budget.percentage <= 80, 'bg-red-200': budget.percentage >= 80 }" >
                            <div :style="'width:' + budget.percentage + '%'"
                                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                                v-bind:class="{ 'bg-emerald-600 ': budget.percentage <= 80, 'bg-red-600': budget.percentage >= 80 }" >
                            </div>
                        </div>

                        <div class="mb-4">
                            <span class="text-xs font-semibold inline-block text-blueGray-400">
                                {{ budget.config.note }}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
  
<script>
import ChartServiceVue from '../../../services/ChartService.vue'
import LocalStorageServiceVue from '../../../services/LocalStorageService.vue'


export default {
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
            const userconfig = LocalStorageServiceVue.get("user_Setting")
            this.currency = userconfig.settings.currency_id
        } catch (e) {
            console.info(e)
        }

    },
    methods: {
        init: function () {
            const _this = this
            ChartServiceVue.getBudgets().then((resp) => {
                resp.forEach((data) => {
                    switch (data.config.period) {
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
  
  