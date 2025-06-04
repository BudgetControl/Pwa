<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-12/12 px-1">
      <HeaderMenu>
        <MenuButton
          :path="'/app/goals/new?tab=2'"
          :label="$t('labels.add')"
        />

        <MenuButton
          :path="'/app/goals'"
          :label="$t('labels.show')"
        />
      </HeaderMenu>
      <CardGoal />
    </div>
  </div>
</template>
<script>
import CardGoal from "@/components/Cards/CardGoal.vue";
import MenuButton from "../../components/GenericComponents/MenuButton.vue";
import HeaderMenu from "../../components/Navbars/HeaderMenu.vue";

export default {
  components: {
    CardGoal, MenuButton, HeaderMenu
  },
};
</script>
