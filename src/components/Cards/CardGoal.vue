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
                <Goal :goal="goal" :currency="currency" v-for="goal in goals"
                    :key="goal.uuid" />
            </div>

        </div>
    </div>
</template>
<script>
import { useAppSettings } from '../../storage/settings.store'
import Goal from '@/components/Goal/Card.vue'

export default {
    data() {
        return {
            goals: [
                {
                    uuid: '1',
                    name: 'Holiday trip',
                    amount: 1400,
                    spent: 900,
                    color: '#4ade80',
                    description: 'A trip to the beach with family.',
                    archive: 0
                },
            ],
            currency: '€'
        }
    },
    components: {
        Goal
    },
    setup() {
        const appSettings = useAppSettings()
        const settings = {
            currency_id: appSettings.get().currency_id
        }

        return {
            settings
        }
    },
    mounted() {
        this.currency = this.settings.currency.id
    },
    methods: {
        init: function () {

        }
    }
}
</script>