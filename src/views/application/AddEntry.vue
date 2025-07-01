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

      <CardAddEntry :entryId="this.$route.params.entry_id" :typeOfEntry="this.$route.query.type" :goalId="this.$route.params.goal_id" />
    </div>
  </div>
</template>

<script>
import CardAddEntry from "@/components/Cards/CardAddEntry.vue";
import MenuButton from "../../components/GenericComponents/MenuButton.vue";
import HeaderMenu from "../../components/Navbars/HeaderMenu.vue";

export default {
  components: {
    CardAddEntry, HeaderMenu, MenuButton
  },
};
</script>
