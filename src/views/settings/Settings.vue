<template>
  <section class="relative py-16 bg-blueGray-200">
    <div class="container mx-auto px-4">
      <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">

          <router-link to="/app/settings/workspace"
            class="active:bg-emerald-600 font-bold text-sm px-6 py-3 m-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            <i class="fas fa-solid fa-chart-pie fa-lg text-emerald-500 mr-2 "><span
                class="p-2 text-black text-lg">{{ $t('labels.workspace') }}</span></i>
            <p class="text-xs text-blueGray-400">{{ $t('text.settings.manage_your_workspace') }}</p>
          </router-link>

          <router-link to="/app/settings/wallet"
            class="active:bg-emerald-600 font-bold text-sm px-6 py-3 m-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            <i class="fas fa-solid fa-wallet fa-lg text-emerald-500 mr-2 "><span
                class="p-2 text-black text-lg">{{ $t('labels.wallet') }}</span></i>
            <p class="text-xs text-blueGray-400">{{ $t('text.settings.manage_wallets') }}</p>
          </router-link>

          <router-link to="/app/settings/category"
            class="active:bg-emerald-600 font-bold text-sm px-6 py-3 m-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            <i class="fas fa-solid fa-chart-pie fa-lg text-emerald-500 mr-2 "><span
                class="p-2 text-black text-lg">{{ $t('labels.category') }}</span></i>
            <p class="text-xs text-blueGray-400">{{ $t('text.settings.manage_entry') }}</p>
          </router-link>

          <router-link to="/app/settings/label"
            class="active:bg-emerald-600 font-bold text-sm px-6 py-3 m-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            <i class="fas fa-solid fa-tags fa-lg text-emerald-500 mr-2 "><span
                class="p-2 text-black text-lg">{{ $t('labels.labels') }}</span></i>
            <p class="text-xs text-blueGray-400">{{ $t('text.settings.customize_entry') }}</p>
          </router-link>

          <router-link to="/app/settings/model"
            class="active:bg-emerald-600 font-bold text-sm px-6 py-3 m-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            <i class="fas fa-solid fa-file-invoice fa-lg text-emerald-500 mr-2 "><span
                class="p-2 text-black text-lg">{{ $t('labels.model') }}</span></i>
            <p class="text-xs text-blueGray-400">{{ $t('text.settings.configure_model') }}</p>
          </router-link>

          <router-link to="/app/settings/currency"
            class="active:bg-emerald-600 font-bold text-sm px-6 py-3 m-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            <i class="fas fa-solid fa-dollar-sign fa-lg text-emerald-500 mr-2 "><span
                class="p-2 text-black text-lg">{{ $t('labels.currency') }}</span></i>
            <p class="text-xs text-blueGray-400">{{ $t('text.settings.set_currency') }}</p>
          </router-link>

          <router-link to="/app/settings/profile"
            class="active:bg-emerald-600 font-bold text-sm px-6 py-3 m-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            <i class="fas fa-solid fa-user fa-lg text-emerald-500 mr-2 "><span
                class="p-2 text-black text-lg">{{ $t('labels.profile') }}</span></i>
            <p class="text-xs text-blueGray-400">{{ $t('text.settings.edit_profile') }}</p>
          </router-link>

          <router-link to="/app/settings/about-us"
            class="active:bg-emerald-600 font-bold text-sm px-6 py-3 m-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            <i class="fas fa-solid fa-microchip fa-lg text-emerald-500 mr-2 "><span class="p-2 text-black text-lg">{{ $t('labels.about_us') }}</span></i>
            <p class="text-xs text-blueGray-400">{{ $t('text.settings.learn') }}</p>
          </router-link>

          <router-link to="/app/settings/assistance"
            class="active:bg-emerald-600 font-bold text-sm px-6 py-3 m-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
            <i class="fas fa-solid fa-cookie-bite fa-lg text-emerald-500 mr-2 "><span
                class="p-2 text-black text-lg">{{ $t('labels.assistance') }}</span></i>
            <p class="text-xs text-blueGray-400">{{ $t('text.settings.write_us') }}</p>
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
