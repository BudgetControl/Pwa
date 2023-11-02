<template>
  <div>
    <navbar />
    <main>
      <section class="relative w-full h-full py-40 min-h-screen">
        <div
          class="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
          :style="`background-image: url('${registerBg2}');`"
        ></div>
        <router-view />
        <footer-small absolute />
      </section>
    </main>
  </div>
</template>
<script>
import Navbar from "@/components/Navbars/IndexNavbar.vue";
import FooterSmall from "@/components/Footers/FooterSmall.vue";
import AuthService from "@/services/AuthService.vue";
import registerBg2 from "@/assets/img/register_bg_2.png";

export default {
  data() {
    return {
      registerBg2,
    };
  },
  components: {
    Navbar,
    FooterSmall,
  },
  mounted() {
        const _this = this
        AuthService.check().then(() => {
          _this.$router.push({ path: '/app/dashboard' })
        }).catch(() => {
          localStorage.clear();
        });
  },
};
</script>
