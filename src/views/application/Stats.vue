<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-12/12 px-4">
      <HeaderMenu>
        <MenuButton
          :path="'/app/entry'"
          :label="$t('labels.add')"
        />

        <MenuButton
          :path="'/app/entries'"
          :label="$t('labels.show')"
        />

        <MenuButton
          :path="'/app/search'"
          :label="$t('labels.search')"
        />
      </HeaderMenu>
      <CardStatsEntries/>
    </div>
  </div>
</template>
<script>
import CardStatsEntries from "@/components/Cards/CardStatsEntries.vue";
import HeaderMenu from "../../components/Navbars/HeaderMenu.vue";
import MenuButton from "../../components/GenericComponents/MenuButton.vue";

export default {
  components: {
    CardStatsEntries, HeaderMenu, MenuButton
  },
};
</script>
