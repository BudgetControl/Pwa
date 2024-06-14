<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-12/12 px-1">
      <HeaderMenu>
        <MenuButton
          :path="'/app/payee/new'"
          :label="$t('labels.add')"
        />

        <MenuButton
          :path="'/app/payee'"
          :label="$t('labels.show')"
        />
      </HeaderMenu>
      <CardPayee />
    </div>
  </div>
</template>
<script>
import CardPayee from "@/components/Cards/Settings/CardPayee.vue";
import MenuButton from "../../components/GenericComponents/MenuButton.vue";
import HeaderMenu from "../../components/Navbars/HeaderMenu.vue";


export default {
  components: {
    CardPayee, MenuButton, HeaderMenu
  },
};
</script>
