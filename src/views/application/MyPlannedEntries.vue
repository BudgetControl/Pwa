<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-12/12 px-1">
      <HeaderMenu>
        <MenuButton
          :path="'/app/planned_entry?planned=true'"
          :label="$t('labels.add')"
        />

        <MenuButton
          :path="'/app/planned-entries'"
          :label="$t('labels.show')"
        />
      </HeaderMenu>
      <CardEntries /> 
    </div>
  </div>
</template>
<script>
import CardEntries from "@/components/Cards/Settings/Planned.vue";
import MenuButton from "../../components/GenericComponents/MenuButton.vue";
import HeaderMenu from "../../components/Navbars/HeaderMenu.vue";

export default {
  components: {
    CardEntries, HeaderMenu, MenuButton
  },
};
</script>
