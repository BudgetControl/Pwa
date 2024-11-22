<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-12/12 px-1">
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
      <CardEntries />
    </div>
  </div>
</template>
<script>
import { useRouter } from "vue-router";
import CardEntries from "@/components/Cards/CardEntries.vue";
import MenuButton from "../../components/GenericComponents/MenuButton.vue";
import HeaderMenu from "../../components/Navbars/HeaderMenu.vue";
import { useAuthStore } from "../../storage/auth-token.store";

export default {
  components: {
    CardEntries, HeaderMenu, MenuButton
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    if (!authStore.authToken) {
      router.push({ path: "/app/auth/login" });
    }

    return {
      authStore, router
    };
  },
  watch: {
    'authStore.authToken': {
      immediate: true,
      handler(newVal) {
        if (!newVal) {
          this.$router.push({ path: "/app/auth/login" });
        }
      }
    }
  }
};
</script>
