<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { exchangeTicket } from '@/services/auth.service';
import { BSpinner } from 'bootstrap-vue-next';

const route = useRoute();

onMounted(async () => {
  const ticket = route.query.ticket as string;
  if (!ticket) {
    window.location.href = '/';
    return;
  }
  try {
    const exchangeResponse = await exchangeTicket(ticket); // BaseResponseDTO
    console.log('🎫 Raw exchange response:', exchangeResponse);
    // Expected shape: { status, message, timestamp, data: { token, user, returnUrl } }
    const inner = exchangeResponse.data;
    if (!inner || !inner.token) {
      console.error('❌ Missing inner token field. Inner:', inner);
      throw new Error('No token field in exchange response');
    }
    // Persist correct token & user objects
    localStorage.setItem('token', inner.token);
    localStorage.setItem('user', JSON.stringify(inner.user));
    console.log('✅ Stored token (len=' + inner.token.length + ') and user for', inner.user?.username);
    // Redirect back to intended path
    const intendedPath = sessionStorage.getItem('intendedPath') || '/';
    sessionStorage.removeItem('intendedPath');
    console.log('🚀 Redirecting to intended path:', intendedPath);
    window.location.href = intendedPath;
  } catch (e) {
    console.error('❌ Exchange failed:', e);
    alert('Login Failed');
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
