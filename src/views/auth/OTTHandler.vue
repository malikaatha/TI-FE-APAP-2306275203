<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { exchangeTicket } from '@/services/auth.service';
import { BSpinner } from 'bootstrap-vue-next';

const route = useRoute();

onMounted(async () => {
  const ticket = route.query.ticket as string;

  if (ticket) {
    try {
      const data = await exchangeTicket(ticket);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      window.location.href = '/';

    } catch (e) {
      console.error(e);
      alert('Login Failed');
      window.location.href = '/';
    }
  } else {
    window.location.href = '/';
  }
});
</script>

<template>
  <div class="text-center mt-5">
    <BSpinner variant="primary" />
    <p class="mt-2">Verifying Login...</p>
  </div>
</template>
