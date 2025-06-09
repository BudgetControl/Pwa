<template>
    <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
        <div class="container x-4 mx-auto py-3">

            <div class="container px-4 mx-auto py-3">
                <h3 class="text-slate-400 text-sm mt-3 mb-6 font-bold uppercase">{{ $t('labels.list_of_all_budgets') }} </h3>
            </div>

            <div
                v-if="goals.length == 0 ">
                <div class="text-center">
                    <p class="text-slate-400 text-lg">{{ $t('labels.no_goals_found') }}</p>
                </div>
            </div>
            <!--content-->
            <div class="border p-2 mt-2" v-if="goals.length != 0">
                <Goal :localGoal="goal" :currency="currency" v-for="goal in goals"
                    :key="goal.uuid" />
            </div>

        </div>
    </div>
</template>
<script>
import { useAppSettings } from '../../storage/settings.store'
import Goal from '@/components/Goal/Card.vue'
import GoalService from '../../services/goal.service'

export default {
    data() {
        return {
            goals: [],
            currency: '€'
        }
    },
    components: {
        Goal
    },
    setup() {
        const appSettings = useAppSettings()
        const goalService = new GoalService()
        const settings = {
            currency_id: appSettings.get().currency_id
        }

        return {
            settings, goalService
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init: function () {
            this.goalService.getAll().then((response) => {
                response.forEach((goal) => {
                    this.goals.push(goal)
                })
            }).catch((error) => {
                console.error('Error fetching goals:', error)
            })
        }
    }
}
</script>