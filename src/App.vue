<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { BNavbar, BNavbarBrand, BContainer, BNavbarNav, BNavItem, BButton, BDropdown, BDropdownItem } from 'bootstrap-vue-next';
import { login, logout } from '@/services/auth.service'; // Pastikan path service auth kamu benar

const route = useRoute();
const isLoggedIn = ref(false);
const username = ref('');
const userRole = ref('');

// Fungsi cek status login dari LocalStorage
const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (token && userStr) {
    isLoggedIn.value = true;
    const user = JSON.parse(userStr);
    username.value = user.username || 'User'; // Sesuaikan field dari API teman
    userRole.value = user.role || '';
  } else {
    isLoggedIn.value = false;
    username.value = '';
    userRole.value = '';
  }
};

// Cek setiap kali pindah halaman (supaya navbar update abis login)
watch(route, () => {
  checkLoginStatus();
});

onMounted(() => {
  checkLoginStatus();
});

const handleLogin = () => {
  login(); // Panggil fungsi redirect ke SSO
};

const handleLogout = () => {
  logout(); // Hapus token & redirect logout SSO
};
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
        </BNavbarNav>

        <BNavbarNav class="ms-auto">
          <div v-if="!isLoggedIn" class="d-flex align-items-center">
            <BButton size="sm" variant="light" @click="handleLogin">Login SSO</BButton>
          </div>

          <div v-else class="d-flex align-items-center gap-3">
            <span class="text-white small">
              Hi, <strong>{{ username }}</strong> ({{ userRole }})
            </span>
            <BButton size="sm" variant="danger" @click="handleLogout">Logout</BButton>
          </div>
        </BNavbarNav>

      </BContainer>
    </BNavbar>

    <BContainer class="mt-4">
      <RouterView />
    </BContainer>
  </div>
</template>
