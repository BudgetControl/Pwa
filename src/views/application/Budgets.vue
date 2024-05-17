<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-12/12 px-1">
      <CardBudget />
    </div>
  </div>
</template>
<script>
import CardBudget from "@/components/Cards/Settings/CardBudget.vue";

export default {
  components: {
    CardBudget
  },
};
</script>
