<template>
  <footer
    class="pb-6"
    :class="[
      absolute ? 'absolute w-full bottom-0 bg-blueGray-800' : 'relative',
    ]"
  >
    <div class="container mx-auto px-4">
      <hr class="mb-6 border-b-1 border-blueGray-600" />
      <div
        class="flex flex-wrap items-center md:justify-between justify-center"
      >
        <div class="w-full md:w-4/12 px-4">
          <div
            class="text-sm text-blueGray-500 font-semibold py-1 text-center md:text-left"
          >
            Copyright © {{ date }}
            <a
              href="https://www.mlabfactory.it?ref=bc-app-small"
              class="text-white hover:text-blueGray-300 text-sm font-semibold py-1"
            >
              MlabFactory
            </a>
          </div>
        </div>
        <div class="w-full md:w-8/12 px-4">
          <ul class="flex flex-wrap list-none md:justify-end justify-center">
            <li>
              <a
                href="https://www.mlabfactory.it?ref=bc-app-small"
                class="text-white hover:text-blueGray-300 text-sm font-semibold block py-1 px-3"
              >
                MlabFactory
              </a>
            </li>
            <li>
              <a
                href="https://www.mlabfactory.it/presentation?ref=bc-app-small"
                class="text-white hover:text-blueGray-300 text-sm font-semibold block py-1 px-3"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="http://blog.www.mlabfactory.it?ref=bc-app-small"
                class="text-white hover:text-blueGray-300 text-sm font-semibold block py-1 px-3"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="https://github.com/BudgetControl/Application/LICENSE.md?ref=bc-app-small"
                class="text-white hover:text-blueGray-300 text-sm font-semibold block py-1 px-3"
              >
                MIT License
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
