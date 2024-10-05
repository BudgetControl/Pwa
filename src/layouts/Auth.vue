<template>
  <div>
    <navbar />
    <main>
      <section class="relative w-full h-full py-40 min-h-screen">
        <div
          class="absolute top-0 w-full h-full bg-emerald-600 bg-no-repeat"
          :style="`background-image: url('https://budgetcontrol-assets.s3.eu-west-1.amazonaws.com/images/pexels-goumbik-590041.jpg');`"
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

export default {
  components: {
    Navbar,
    FooterSmall,
  },
};
</script>
