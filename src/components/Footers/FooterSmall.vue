<template>
  <footer
    class="pb-6"
    :class="[
      absolute ? 'absolute w-full bottom-0 bg-emerald-800' : 'relative',
    ]"
  >
    <div class="container mx-auto px-4">
      <hr class="mb-6 border-b-1 border-slate-600" />
      <div
        class="flex flex-wrap items-center md:justify-between justify-center"
      >
        <div class="w-full md:w-4/12 px-4">
          <div
            class="text-sm font-semibold py-1 text-center md:text-left"
          >
            Copyright © {{ date }}
            <a
              href="https://www.budgetcontrol.cloud?ref=bc-app-small"
              class="text-white hover:text-slate-300 text-sm font-semibold py-1"
            >
            BudgetControl
            </a>
          </div>
        </div>
        <div class="w-full md:w-8/12 px-4">
          <ul class="flex flex-wrap list-none md:justify-end justify-center">
            <li>
              <a
                href="https://www.mlabfactory.it?ref=bc-app-small"
                class="text-white hover:text-slate-300 text-sm font-semibold block py-1 px-3"
              >
                MlabFactory s.r.l
              </a>
            </li>
            <li>
              <a
                href="https://www.budgetcontrol.cloud/about-budgetcontrol?ref=bc-app-small"
                class="text-white hover:text-slate-300 text-sm font-semibold block py-1 px-3"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="https://github.com/BudgetControl/Pwa?tab=AGPL-3.0-1-ov-file#readme?ref=bc-app-small"
                class="text-white hover:text-slate-300 text-sm font-semibold block py-1 px-3"
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
  props: {
    absolute: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
