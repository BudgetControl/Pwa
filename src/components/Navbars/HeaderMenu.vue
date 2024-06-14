<template>
  <!-- HEADER Navbar -->
  <div class="flex flex-wrap py-1">
    <div class="w-full px-1">
      <nav class="relative flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-emerald-500 rounded">
        <div class="container px-4 mx-auto flex flex-l w-full items-center justify-between">
          <div class="flex flex-l items-center w-full" id="example-navbar-info">
            <ul class="flex flex-l lg:flex-row list-none ml-auto w-full justify-center">
              <slot></slot>
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
   name: 'HeaderMenu'
};
</script>
