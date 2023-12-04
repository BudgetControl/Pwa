<template>
  <div>
    <sidebar />
    <div class="relative md:ml-64 bg-blueGray-100">
      <div class="px-1 md:px-10 mx-auto w-full -m-24">
        <HeaderMenu />
        <main class="profile-page">
          <section class="relative block h-300-px">
            <div class="absolute top-0 w-full h-full bg-center bg-cover" style="
            background-image: url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80');
          ">
              <span id="blackOverlay" class="w-full h-full absolute opacity-50 bg-black"></span>
            </div>
            <div class="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
              style="transform: translateZ(0);">
              <svg class="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
                version="1.1" viewBox="0 0 2560 100" x="0" y="0">
                <polygon class="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
              </svg>
            </div>
          </section>
          <router-view />
        </main>
        <footer-admin />
      </div>
    </div>
  </div>
</template>
<script>
import HeaderMenu from "@/components/Navbars/HeaderMenu.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import FooterAdmin from "@/components/Footers/FooterAdmin.vue";
import AuthService from "@/services/AuthService.vue";

export default {
  name: "admin-layout",
  components: {
    HeaderMenu,
    Sidebar,
    FooterAdmin,
  },
  async beforeMount() {
    try {
      const _this = this
      AuthService.check().catch((response) => {
        console.log("res", response)
        localStorage.clear();
        _this.$router.push({ path: '/app/auth/login' })
      });
    } catch {
      localStorage.clear();
      this.$router.push({ path: '/app/auth/login' })
    }
  }
};
</script>

<style scoped>
.h-300-px {
  height: 300px;
}
</style>