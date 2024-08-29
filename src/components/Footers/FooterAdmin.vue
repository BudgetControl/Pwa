<template>
  <footer class="block py-4">
    <div class="container mx-auto px-4">
      <hr class="mb-4 border-b-1 border-blueGray-200" />
      <div
        class="flex flex-wrap items-center md:justify-between justify-center"
      >
        <div class="w-full md:w-4/12 px-4">
          <div
            class="text-sm font-semibold text-white py-1 text-center md:text-left"
          >
            Copyright © {{ date }}
            <a
              href="https://www.budgetcontrol.cloud?ref=bc-app-admin"
              class="text-blueGray-500 hover:text-blueGray-700 text-sm font-semibold py-1"
            >
            BudgetControl
            </a>
          </div>
        </div>
        <div class="w-full md:w-8/12 px-4">
          <ul class="flex flex-wrap list-none md:justify-end justify-center">
            <li>
              <a
                href="https://www.mlabfactory.it?ref=bc-app-admin"
                class="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
              >
                MlabFactory
              </a>
            </li>
            <li>
              <a
                href="https://www.budgetcontrol.cloud/about-budgetcontrol?ref=bc-app-admin"
                class="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="https://github.com/BudgetControl/Pwa?tab=AGPL-3.0-1-ov-file#readme?ref=bc-app-admin"
                class="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
              >
                AGPL-3.0 license
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      date: new Date().getFullYear(),
    };
  },
};
</script>
