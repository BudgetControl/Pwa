<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-12/12 px-1">
      <CardPayee />
    </div>
  </div>
</template>
<script>
import CardPayee from "@/components/Cards/Settings/CardPayee.vue";

export default {
  components: {
    CardPayee
  },
};
</script>
