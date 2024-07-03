<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-12/12 px-4">
      <CardStatsEntries/>
    </div>
  </div>
</template>
<script>
import CardStatsEntries from "@/components/Cards/CardStatsEntries.vue";
import MenuButton from "../../components/GenericComponents/MenuButton.vue";

export default {
  components: {
    CardStatsEntries, MenuButton
  },
};
</script>
