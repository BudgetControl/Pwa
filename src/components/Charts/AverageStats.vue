<template>
    <div class="flex flex-wrap" id="widget">
        <div class="px-2 w-full">
            <card-stats :statSubtitle="$t('labels.average_expenses')"
                :statTitle="`${stats.averageExpenses.statTitle} €`" statDescripiron="Last month"
                statIconName="fas fa-solid fa-credit-card" statIconColor="bg-red-500" />
        </div>

        <div class="px-2 w-full">
            <card-stats :statSubtitle="$t('labels.average_incoming')"
                :statTitle="`${stats.averageIncoming.statTitle} €`" statDescripiron="Last month"
                statIconName="fas fa-regular fa-money-bill" statIconColor="bg-sky-500" />
        </div>

        <div class="px-2 w-full">
            <card-stats :statSubtitle="$t('labels.average_savings')" :statTitle="`${stats.averageSavings.statTitle} €`"
                statDescripiron="Last month" statIconName="fas fa-solid fa-piggy-bank" statIconColor="bg-emerald-500" />
        </div>

        <div class="px-2 w-full">
            <card-stats :statSubtitle="$t('labels.remaining_expenses')"
                :statTitle="`${stats.plannedExpenses.statTitle} €`" statDescripiron="Last month"
                statIconName="fas fa-solid fa-plane" statIconColor="bg-amber-500" />
        </div>

    </div>
</template>

<script>
import CardStats from '@/components/Cards/CardStats.vue';
import StatsService from '../../services/stats.service';


export default {
    components: {
        CardStats
    },
    setup() {

        const statsService = new StatsService()

        return {
            statsService
        }
    },
    data() {
        return {
            stats: {
                averageIncoming: {
                    statTitle: 0,
                },
                averageExpenses: {
                    statTitle: 0,
                },
                averageSavings: {
                    statTitle: 0,
                },
                plannedExpenses: {
                    statTitle: 0,
                }
            }
        }
    },
    mounted: async function () {
        this.getAverageIncoming()
        this.getAverageExpenses()
        this.getAverageSavings()
        this.getPlannedExpenses()
    },
    methods: {
        getAverageIncoming: function () {
            this.statsService.getAverageIncoming().then((resp) => {
                let data = resp
                this.stats.averageIncoming.statTitle = data.total.toFixed(2)
            }).catch((error) => {
                console.error(error);
            })
        },
        getAverageExpenses: function () {
            this.statsService.getAverageExpenses().then((resp) => {
                let data = resp
                const total = data.total * -1
                this.stats.averageExpenses.statTitle = total.toFixed(2)
            }).catch((error) => {
                console.error(error);
            })
        },
        getAverageSavings: function () {
            this.statsService.getAverageSavings().then((resp) => {
                let data = resp
                const total = data.total * -1
                this.stats.averageSavings.statTitle = total.toFixed(2)
            }).catch((error) => {
                console.error(error);
            })
        },
        getPlannedExpenses: function () {
            this.statsService.getPlannedExpenses().then((resp) => {
                let data = resp
                const total = data.total * -1
                this.stats.plannedExpenses.statTitle = total.toFixed(2)
            }).catch((error) => {
                console.error(error);
            })
        }
    }
};
</script>
