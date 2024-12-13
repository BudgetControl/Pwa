<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-12/12 px-1">
      <HeaderMenu>
        <MenuButton
          :path="'/app/budgets/new?tab=2'"
          :label="$t('labels.add')"
        />

        <MenuButton
          :path="'/app/budgets'"
          :label="$t('labels.show')"
        />
      </HeaderMenu>
      <CardBudget />
    </div>
  </div>
</template>
<script>
import CardBudget from "@/components/Cards/Settings/CardBudget.vue";
import MenuButton from "../../components/GenericComponents/MenuButton.vue";
import HeaderMenu from "../../components/Navbars/HeaderMenu.vue";

export default {
  components: {
    CardBudget, MenuButton, HeaderMenu
  },
};
</script>
