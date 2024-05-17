<template>
  <section class="relative py-16 bg-blueGray-200">
    <div class="container mx-auto px-4">
      <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">

          <router-link to="/app/settings/workspace"
            class="active:bg-emerald-600 font-bold text-sm px-6 py-3 m-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            <i class="fas fa-solid fa-chart-pie fa-lg text-emerald-500 mr-2 "><span
                class="p-2 text-black text-lg">Workspace</span></i>
            <p class="text-xs text-blueGray-400">Manage your workspaces.</p>
          </router-link>

          <router-link to="/app/settings/wallet"
            class="active:bg-emerald-600 font-bold text-sm px-6 py-3 m-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            <i class="fas fa-solid fa-wallet fa-lg text-emerald-500 mr-2 "><span
                class="p-2 text-black text-lg">Wallet</span></i>
            <p class="text-xs text-blueGray-400">Manage wallets, change icons, color.</p>
          </router-link>

          <router-link to="/app/settings/category"
            class="active:bg-emerald-600 font-bold text-sm px-6 py-3 m-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            <i class="fas fa-solid fa-chart-pie fa-lg text-emerald-500 mr-2 "><span
                class="p-2 text-black text-lg">Category</span></i>
            <p class="text-xs text-blueGray-400">Manage your entry categories.</p>
          </router-link>

          <router-link to="/app/settings/label"
            class="active:bg-emerald-600 font-bold text-sm px-6 py-3 m-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            <i class="fas fa-solid fa-tags fa-lg text-emerald-500 mr-2 "><span
                class="p-2 text-black text-lg">Labels</span></i>
            <p class="text-xs text-blueGray-400">Customize entry labels.</p>
          </router-link>

          <router-link to="/app/settings/model"
            class="active:bg-emerald-600 font-bold text-sm px-6 py-3 m-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            <i class="fas fa-solid fa-file-invoice fa-lg text-emerald-500 mr-2 "><span
                class="p-2 text-black text-lg">Model</span></i>
            <p class="text-xs text-blueGray-400">Configure entry models.</p>
          </router-link>

          <router-link to="/app/settings/currency"
            class="active:bg-emerald-600 font-bold text-sm px-6 py-3 m-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            <i class="fas fa-solid fa-dollar-sign fa-lg text-emerald-500 mr-2 "><span
                class="p-2 text-black text-lg">Currency</span></i>
            <p class="text-xs text-blueGray-400">Set your preferred currency.</p>
          </router-link>

          <router-link to="/app/settings/profile"
            class="active:bg-emerald-600 font-bold text-sm px-6 py-3 m-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            <i class="fas fa-solid fa-user fa-lg text-emerald-500 mr-2 "><span
                class="p-2 text-black text-lg">Profile</span></i>
            <p class="text-xs text-blueGray-400">Edit your user profile.</p>
          </router-link>

          <router-link to="/app/settings/about-us"
            class="active:bg-emerald-600 font-bold text-sm px-6 py-3 m-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            <i class="fas fa-solid fa-microchip fa-lg text-emerald-500 mr-2 "><span class="p-2 text-black text-lg">About
                Us</span></i>
            <p class="text-xs text-blueGray-400">Learn more about our team.</p>
          </router-link>

          <router-link to="/app/settings/assistance"
            class="active:bg-emerald-600 font-bold text-sm px-6 py-3 m-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            <i class="fas fa-solid fa-cookie-bite fa-lg text-emerald-500 mr-2 "><span
                class="p-2 text-black text-lg">assistance</span></i>
            <p class="text-xs text-blueGray-400">Write us for assistance.</p>
          </router-link>

        </div>
      </div>
    </div>
  </section>
</template>
<script>

export default {
  components: {
  },
};
</script>
