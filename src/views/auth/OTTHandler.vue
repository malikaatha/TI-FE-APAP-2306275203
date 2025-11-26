<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { exchangeTicket } from '@/services/auth.service';
import { BSpinner } from 'bootstrap-vue-next';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const ticket = route.query.ticket as string;

  if (ticket) {
    try {
      const data = await exchangeTicket(ticket);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/');
    } catch (e) {
      alert('Login Failed');
      router.push('/');
    }
  } else {
    router.push('/');
  }
});
</script>

<template>
  <div class="text-center mt-5">
    <BSpinner />
    <p>Logging in...</p>
  </div>
</template>
