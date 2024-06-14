<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg ">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings" title="Label settings" />

                    <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                        <div class="px-4 py-5 flex-auto">
                            <div class="tab-content tab-space">

                                <BudgetComponent :budget="budget" :currency="currency" v-for="budget in budgets.week" :key="budget.id" />

                                <BudgetComponent :budget="budget" :currency="currency" v-for="budget in budgets.month" :key="budget.id" />

                                <BudgetComponent :budget="budget" :currency="currency" v-for="budget in budgets.year" :key="budget.id" />
                                
                                <BudgetComponent :budget="budget" :currency="currency" v-for="budget in budgets.custom" :key="budget.id" />

                                <a class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    href="/app/settings/budget">
                                    {{ $t('labels.create_new_budget') }}
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
import BudgetComponent from '../../components/GenericComponents/BudgetComponent.vue';

export default {
    components: {
        HeaderButton, BudgetComponent
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

  