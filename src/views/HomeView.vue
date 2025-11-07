<script setup lang="ts">
// --- TAMBAHKAN BARIS-BARIS INI ---
import { BContainer, BRow, BCol, BCard, BCardText, BButton } from 'bootstrap-vue-next'
</script>

<template>
  <main>
    <BContainer class="text-center py-5">
      <h1 class="display-4">Tour Package Management System</h1>
      <p class="lead">
        Manage your tour packages, activities, and plans efficiently.
      </p>
      <hr class="my-4" />

      <BRow>
        <BCol md="4">
          <BCard title="Packages" class="mb-3">
            <BCardText>
              Create tour packages and organize them with plans.
            </BCardText>
            <BButton variant="primary" to="/packages">Manage Packages</BButton>
          </BCard>
        </BCol>

        <BCol md="4">
          <BCard title="Statistics" class="mb-3">
            <BCardText>
              View reports and analytics for your tour packages.
            </BCardText>
            <BButton variant="primary" to="/statistics">View Reports</BButton>
          </BCard>
        </BCol>
      </BRow>
    </BContainer>
  </main>
</template>
