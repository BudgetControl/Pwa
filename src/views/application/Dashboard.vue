<template>
  <div class="mt-10">
    <div class="py-5">
      <FilterBar />
    </div>
    <div class="flex flex-wrap">
      <div class="w-full">
        <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
          <div class="px-4 py-5 flex-auto">
            <CardLine_IncomingExpensesChart />
          </div>
        </div>
      </div>
      <div class="w-full xl:w-8/12 px-4">
        <card-bar-chart path="category" title="Category" ID_GRAPH="category_all" />
      </div>
      <div class="w-full xl:w-4/12 px-4">
        <CardPieLabelChart ID_GRAPH="label" />
      </div>
    </div>
    <div class="flex flex-wrap mt-4">
      <CardCategoryResume />
    </div>
  </div>
</template>
<script>
import FilterBar from "@/components/Navbars/FilterBar.vue";
import CardBarChart from "@/components/Cards/Chart/CardBarChart.vue";
import CardLine_IncomingExpensesChart from "@/components/Cards/Chart/CardLine_IncomingExpensesChart.vue";
import CardPieLabelChart from "../../components/Cards/Chart/CardPieLabelChart.vue";
import CardCategoryResume from "../../components/Cards/Chart/CardCategoryResume.vue";
import AuthService from '../../services/AuthService.vue';

export default {
  name: "dashboard-page",
  components: {
    FilterBar,
    CardBarChart,
    CardLine_IncomingExpensesChart,
    CardPieLabelChart,
    CardCategoryResume
  },
  data() {
    return {
      openTab: 1
    }
  },
  methods: {
    toggleTabs: function (tabNumber) {
      this.openTab = tabNumber
    }
  }
};
</script>
