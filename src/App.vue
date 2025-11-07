<script setup lang="ts">
import { RouterView } from 'vue-router'

// --- Impor SEMUA komponen BootstrapVue yang digunakan di template ---
import { BNavbar, BNavbarBrand, BContainer } from 'bootstrap-vue-next'
</script>

<template>
  <div>
    <!-- Sekarang komponen ini akan dikenali dan dirender dengan benar -->
    <BNavbar toggleable="lg" type="dark" variant="primary">
      <BNavbarBrand href="#">TravelAPAP</BNavbarBrand>
    </BNavbar>

    <BContainer class="mt-4">
      <RouterView />
    </BContainer>
  </div>
</template>

<style scoped>
/* Kosongkan atau isi sesuai kebutuhan */
</style>
