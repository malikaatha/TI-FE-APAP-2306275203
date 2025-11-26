<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import {
  BNavbar, BNavbarBrand, BContainer, BNavbarNav, BNavItem,
  BButton, BCollapse, BNavbarToggle, BNavItemDropdown, BDropdownItem
} from 'bootstrap-vue-next';
import { login, logout } from '@/services/auth.service';

const route = useRoute();
const isLoggedIn = ref(false);
const username = ref('');
const userRole = ref('');

// --- LOGIC SAMA SEPERTI SEBELUMNYA ---
const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (token && userStr) {
    isLoggedIn.value = true;
    try {
      const user = JSON.parse(userStr);
      // Sesuaikan field ini dengan respon API temanmu
      username.value = user.username || user.nama || 'User';
      userRole.value = user.role || '';
    } catch (e) {
      console.error("Error parsing user data", e);
    }
  } else {
    isLoggedIn.value = false;
    username.value = '';
    userRole.value = '';
  }
};

watch(route, checkLoginStatus);
onMounted(checkLoginStatus);

const handleLogin = () => login();
const handleLogout = () => logout();
</script>

<template>
  <div>
    <BNavbar toggleable="lg" variant="white" class="shadow-sm sticky-top py-3">
      <BContainer>

        <BNavbarBrand to="/" class="fw-bold text-primary fs-4 tracking-tight">
          TravelAPAP
        </BNavbarBrand>

        <BNavbarToggle target="nav-collapse" />

        <BCollapse id="nav-collapse" is-nav>
          <BNavbarNav class="ms-4 gap-3 fw-medium">
            <BNavItem to="/packages" active-class="active-link">Packages</BNavItem>
            <BNavItem to="/activities" active-class="active-link">Activities</BNavItem>
            <BNavItem to="/loyalty/coupons" active-class="active-link">Loyalty</BNavItem>
            <BNavItem to="/statistics" active-class="active-link">Statistics</BNavItem>
          </BNavbarNav>

          <BNavbarNav class="ms-auto align-items-center mt-3 mt-lg-0">

            <!-- CASE: BELUM LOGIN -->
            <div v-if="!isLoggedIn">
              <BButton
                variant="primary"
                pill
                class="px-4 fw-bold"
                @click="handleLogin"
              >
                Login SSO
              </BButton>
            </div>

            <!-- CASE: SUDAH LOGIN-->
            <BNavItemDropdown v-else right no-caret>
              <template #button-content>
                <div class="d-flex align-items-center gap-2 border px-3 py-1 rounded-pill bg-light text-dark">
                  <div class="avatar-circle bg-primary text-white">
                    {{ username.charAt(0).toUpperCase() }}
                  </div>
                  <div class="d-flex flex-column text-start" style="line-height: 1.2;">
                    <span class="fw-bold small">{{ username }}</span>
                    <span class="text-muted x-small" style="font-size: 0.75rem;">{{ userRole }}</span>
                  </div>
                </div>
              </template>

              <BDropdownItem href="#">Profile</BDropdownItem>
              <BDropdownItem class="text-danger" @click="handleLogout">Logout</BDropdownItem>
            </BNavItemDropdown>

          </BNavbarNav>
        </BCollapse>
      </BContainer>
    </BNavbar>

    <BContainer class="mt-5">
      <RouterView />
    </BContainer>
  </div>
</template>

<style scoped>
.tracking-tight {
  letter-spacing: -0.5px;
}

.nav-link {
  color: #6c757d !important;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: #0d6efd !important;
}

.active-link {
  color: #0d6efd !important;
  font-weight: 600;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

@media (max-width: 991px) {
  .navbar-nav.ms-4 {
    margin-left: 0 !important;
    margin-top: 1rem;
  }
}
</style>
