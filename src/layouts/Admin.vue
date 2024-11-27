<template>
  <div>
    <sidebar />
    <div class="relative md:ml-64 bg-slate-100">
      <div class="px-1 md:px-10 mx-auto w-full">
        <main class="profile-page">
          <section class="relative block h-150-px">
            <div class="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
              style="transform: translateZ(0);">
              <svg class="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
                version="1.1" viewBox="0 0 2560 100" x="0" y="0">
                <polygon class="text-slate-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
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
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import FooterAdmin from "@/components/Footers/FooterAdmin.vue";

export default {
  name: "admin-layout",
  components: {
    Sidebar,
    FooterAdmin,
  },
};
</script>

<style scoped>
.h-300-px {
  height: 300px;
}
</style>