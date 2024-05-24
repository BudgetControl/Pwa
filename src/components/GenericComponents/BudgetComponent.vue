<template>
    <div class="relative pt-1">
        <router-link :to="'/app/budgets/edit/' + budget.budget.uuid" class="relative pt-1">
            <div class="flex mb-2 items-center justify-between">
                <div>
                    <span
                        class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                        {{ budget.budget.name }} {{ budget.budget.amount }} {{ currency }}
                    </span>
                </div>
                <div class="text-right">
                    <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                        {{ budget.totalRemaining }}{{ currency }}
                    </span>

                    <span class="text-xs font-semibold inline-block text-emerald-600">
                         {{ budget.totalRemainingPercentage }}
                    </span>
                </div>
            </div>
            <div class="overflow-hidden h-2 mb-4 text-xs flex rounded"
                v-bind:class="{ 'bg-emerald-200 ': budget.percentage <= 80, 'bg-red-200': budget.percentage >= 80 }">
                <div :style="'width:' + budget.totalSpentPercentage"
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
</template>

<script>
export default {
    props: {
        budget: {
            type: Object,
            required: true
        },
        currency: {
            type: String,
            required: true
        }
    },
    mounted() {
        this.budget.totalRemaining = this.budget.totalRemaining < 0 ? 0 : this.budget.totalRemaining
    }
}
</script>