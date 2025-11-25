<script setup lang="ts">
import { RouterView } from 'vue-router'
import { BNavbar, BNavbarBrand, BContainer, BNavbarNav, BNavItem } from 'bootstrap-vue-next'
</script>

<template>
  <div>
    <BNavbar toggleable="lg" type="dark" variant="primary">
      <BContainer>
        <BNavbarBrand to="/">TravelAPAP</BNavbarBrand>

        <BNavbarNav>
          <BNavItem to="/packages">Packages</BNavItem>
          <BNavItem to="/activities">Activities</BNavItem>
          <BNavItem to="/loyalty/coupons">Loyalty</BNavItem>
          <BNavItem to="/statistics">Statistics</BNavItem>
        </BNavbarNav>
      </BContainer>
    </BNavbar>

    <BContainer class="mt-4">
      <RouterView />
    </BContainer>
  </div>
</template>

<style scoped>
.navbar-brand {
  font-weight: bold;
}
</style>
