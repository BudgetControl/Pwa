<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-12/12 px-4">
      <HeaderMenu>
        <MenuButton
          :path="'/app/entry'"
          :label="$t('labels.add')"
        />

        <MenuButton
          v-if="this.$route.query.show !== 'payee'"
          :path="'/app/entries'"
          :label="$t('labels.show')"
        />

        <MenuButton
          v-if="this.$route.query.show === 'payee'"
          :path="'/app/payee'"
          :label="$t('labels.show')"
        />

        <MenuButton v-if="this.$route.query.show !== 'payee'"
          :path="'/app/search'"
          :label="$t('labels.search')"
        />
      </HeaderMenu>

      <AddSaving :entryId="this.$route.params.entry_id" :typeOfEntry="this.$route.query.type" />
    </div>
  </div>
</template>

<script>
import MenuButton from "../../components/GenericComponents/MenuButton.vue";
import HeaderMenu from "../../components/Navbars/HeaderMenu.vue";
import AddSaving from "../../components/Cards/Entry/AddSaving.vue";

export default {
  components: {
    AddSaving, HeaderMenu, MenuButton
  },
};
</script>
