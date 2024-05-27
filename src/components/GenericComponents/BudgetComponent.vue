<template>
    <div class="relative pt-1">
        <router-link :to="'/app/budgets/edit/' + localBudget.budget.uuid" class="relative pt-1">
            <div class="flex mb-2 items-center justify-between">
                <div>
                    <span
                        class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                        {{ localBudget.budget.name }} {{ localBudget.budget.amount }} {{ currency }}
                    </span>
                </div>
                <div class="text-right">
                    <span class="text-xs font-semibold inline-block text-blueGray-400 ml-10">
                        {{ localBudget.totalRemaining }}{{ currency }}
                    </span>

                    <span class="text-xs font-semibold inline-block text-emerald-600">
                         {{ localBudget.totalRemainingPercentage }}
                    </span>
                </div>
            </div>
            <div class="overflow-hidden h-2 mb-4 text-xs flex rounded"
                v-bind:class="{ 'bg-emerald-200 ': localBudget.percentage <= 80, 'bg-red-200': localBudget.percentage >= 80 }">
                <div :style="'width:' + localBudget.totalSpentPercentage"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                    v-bind:class="{ 'bg-emerald-600 ': localBudget.percentage <= 80, 'bg-red-600': localBudget.percentage >= 80 }">
                </div>
            </div>

            <div class="mb-4">
                <span class="text-xs font-semibold inline-block text-blueGray-400">
                    {{ localBudget.description }}
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
    data() {
    return {
      localBudget: { ...this.budget }
    };
  },
    mounted() {
        const data = this.localBudget;
        this.localBudget.totalRemaining = data.totalRemaining < 0 ? 0 : data.totalRemaining;
    }
}
</script>