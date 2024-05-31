<template>
  <!-- HEADER Navbar -->
  <div class="flex flex-wrap py-1">
    <div class="w-full px-1">
      <nav class="relative flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-emerald-500 rounded">
        <div class="container px-4 mx-auto flex flex-l w-full items-center justify-between">
          <div class="flex flex-l items-center w-full" id="example-navbar-info">
            <ul class="flex flex-l lg:flex-row list-none ml-auto w-full justify-center">
              <li class="nav-item border border-solid border-blueGray-100 mx-2">
                <router-link
                  to="/app/entry"
                  v-slot="{ href, navigate, isActive }"
                >
                  <a
                    :href="href"
                    @click="navigate"
                    class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                    :class="[
                      isActive
                        ? 'text-white hover:text-emerald-600'
                        : 'text-white hover:text-blueGray-500',
                    ]"
                  >
                  {{ $t('labels.add') }}
                  </a>
                </router-link>
              </li>
              <li class="nav-item border border-solid border-blueGray-100 mx-2">
                <router-link
                  to="/app/entries"
                  v-slot="{ href, navigate, isActive }"
                >
                  <a
                    :href="href"
                    @click="navigate"
                    class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                    :class="[
                      isActive
                        ? 'text-white hover:text-emerald-600'
                        : 'text-white hover:text-blueGray-500',
                    ]"
                  >
                  {{ $t('labels.show') }}
                  </a>
                </router-link>
              </li>
              <li class="nav-item border border-solid border-blueGray-100 mx-2">
                <router-link
                  to="/app/search"
                  v-slot="{ href, navigate, isActive }"
                >
                  <a
                    :href="href"
                    @click="navigate"
                    class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                    :class="[
                      isActive
                        ? 'text-white hover:text-emerald-600'
                        : 'text-white hover:text-blueGray-500',
                    ]"
                  >
                  {{ $t('labels.search') }}
                  </a>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </div>
  <!-- End HEADER Navbar -->
</template>

<script>

export default {
  components: {
  },
};
</script>
