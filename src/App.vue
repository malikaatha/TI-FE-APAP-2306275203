<script setup lang="ts">
import { RouterView } from 'vue-router'
import { BNavbar, BNavbarBrand, BContainer, BNavbarNav, BNavItem } from 'bootstrap-vue-next'
</script>

<template>
  <div>
    <BNavbar toggleable="lg" type="dark" variant="primary">
      <BNavbarBrand to="/">TravelAPAP</BNavbarBrand>

      <BNavbarNav>
        <BNavItem to="/packages">Packages</BNavItem>
        <BNavItem to="/statistics">Statistics</BNavItem>
      </BNavbarNav>
    </BNavbar>

    <BContainer class="mt-4">
      <RouterView />
    </BContainer>
  </div>
</template>
