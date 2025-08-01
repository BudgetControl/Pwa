<template>
  <div>
    <sidebar />
    <div class="relative md:ml-64 bg-slate-100">
      <admin-navbar />
      <header-stats />
      <div class="px-1 md:px-10 mx-auto w-full -m-24">
        <router-view />
        <footer-admin />
      </div>
    </div>
  </div>
</template>
<script>
import AdminNavbar from "@/components/Navbars/AdminNavbar.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import HeaderStats from "@/components/Headers/HeaderStats.vue";
import FooterAdmin from "@/components/Footers/FooterAdmin.vue";
import FirebaseMessagingService from "../services/firebase/firebase-messaging.service";

export default {
  name: "admin-layout",
  components: {
    AdminNavbar,
    Sidebar,
    HeaderStats,
    FooterAdmin,
  },
  async mounted() {
    // Inizializza Firebase Messaging Service
    const firebaseMessagingService = new FirebaseMessagingService();
    await firebaseMessagingService.initializeNotifications();
    firebaseMessagingService.getToken().then((token) => {
      console.log("Firebase Token:", token);
    }).catch((error) => {
      console.error("Error getting Firebase token:", error);
    });
  },
  methods: {
    parentFunction() {
      console.log('Funzione del componente genitore chiamata');
    }
  }
};
</script>