<script setup lang="ts">
const route = useRoute();
const supabase = useSupabaseClient();
const router = useRouter();

const error = ref<string | null>(null);
const success = ref(false);
const isLoading = ref(true);

onMounted(async () => {
  try {
    // Get the code from query parameters (Supabase sends it as 'code')
    const code = route.query.code as string;
    const token = route.query.token as string;
    const type = route.query.type as string;

    // Also check URL hash for tokens (older Supabase versions)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hashToken = hashParams.get('access_token');
    const hashType = hashParams.get('type');

    // First, check if Supabase already created a session automatically
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (session && !sessionError) {
      // User is already confirmed and logged in via the redirect
      // Sign out so they need to log in manually
      await supabase.auth.signOut();
      success.value = true;
      isLoading.value = false;
      
      setTimeout(() => {
        router.push('/login?confirmed=true');
      }, 2000);
      return;
    }

    // If no session, try to verify with the code/token
    if (code) {
      // Try verifyOtp with the code (for email confirmation)
      const { error: confirmError } = await supabase.auth.verifyOtp({
        token: code,
        type: 'email'
      });

      if (confirmError) {
        // If verifyOtp fails, the code might be for PKCE flow
        // In that case, Supabase should have already handled it via redirect
        error.value = confirmError.message || 'Email confirmation failed. The link may have expired.';
        isLoading.value = false;
        return;
      }

      // If successful, sign out and redirect
      await supabase.auth.signOut();
      success.value = true;
      isLoading.value = false;

      setTimeout(() => {
        router.push('/login?confirmed=true');
      }, 2000);
    } else if (token && type) {
      // Handle token-based confirmation
      const { error: confirmError } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type as any
      });

      if (confirmError) {
        error.value = confirmError.message || 'Email confirmation failed';
        isLoading.value = false;
        return;
      }

      await supabase.auth.signOut();
      success.value = true;
      isLoading.value = false;

      setTimeout(() => {
        router.push('/login?confirmed=true');
      }, 2000);
    } else if (hashToken && hashType === 'signup') {
      // Handle hash-based confirmation (older format)
      const { error: confirmError } = await supabase.auth.verifyOtp({
        token_hash: hashToken,
        type: 'signup'
      });

      if (confirmError) {
        error.value = confirmError.message || 'Email confirmation failed';
        isLoading.value = false;
        return;
      }

      await supabase.auth.signOut();
      success.value = true;
      isLoading.value = false;

      setTimeout(() => {
        router.push('/login?confirmed=true');
      }, 2000);
    } else {
      error.value = 'Invalid confirmation link. Please check your email for the correct link or try signing up again.';
      isLoading.value = false;
    }
  } catch (err: any) {
    error.value = err.message || 'An error occurred during email confirmation';
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="fixed inset-0 overflow-y-auto bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
    <div class="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 max-w-md w-full text-center">
      <div v-if="isLoading" class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600">Confirming your email...</p>
      </div>

      <div v-else-if="success" class="space-y-4">
        <div class="text-green-500 text-5xl mb-4">✓</div>
        <h2 class="text-2xl font-bold text-gray-800">Email Confirmed!</h2>
        <p class="text-gray-600">Your email has been successfully confirmed. Redirecting to login...</p>
      </div>

      <div v-else-if="error" class="space-y-4">
        <div class="text-red-500 text-5xl mb-4">✗</div>
        <h2 class="text-2xl font-bold text-gray-800">Confirmation Failed</h2>
        <p class="text-red-600">{{ error }}</p>
        <button
          @click="router.push('/login')"
          class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  </div>
</template>

