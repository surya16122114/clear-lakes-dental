<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();

// Get user's name from user metadata or email
const userName = computed(() => {
  if (user.value) {
    // Try to get name from user metadata first
    const fullName = user.value.user_metadata?.full_name || user.value.user_metadata?.name;
    if (fullName) {
      return fullName;
    }
    // Fallback to email username if no name in metadata
    if (user.value.email) {
      return user.value.email.split('@')[0];
    }
  }
  return '';
});

// Check if a route is active
const isActive = (path: string) => {
  return route.path === path;
};

async function handleLogout() {
  try {
    await supabase.auth.signOut();
    await navigateTo("/login");
  } catch (error) {
    console.error("Error logging out:", error);
  }
}
</script>

<!-- Example of how to create a reusable component -->
<template>
  <div class="flex flex-col w-full bg-[#0a0e27] border-b border-gray-800">
    <!-- Top row: Logo, Database Demo heading (centered), and User info -->
    <div class="flex flex-row justify-between items-center w-full px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 relative">
      <img
        src="../public/full_logo.png"
        alt="Clear Lakes Dental"
        class="w-20 sm:w-24 md:w-32 lg:w-[256px] h-auto flex-shrink-0"
      />
      <h1 class="text-base sm:text-lg md:text-xl lg:text-3xl font-bold text-white absolute left-1/2 transform -translate-x-1/2 z-10 px-1 sm:px-2">Database Demo</h1>
      <div v-if="user" class="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
        <span class="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white whitespace-nowrap">Welcome, {{ userName }}!</span>
        <button
          @click="handleLogout"
          class="text-xs sm:text-xs md:text-sm bg-red-500 text-white px-2 sm:px-3 md:px-5 py-1 sm:py-1.5 md:py-2.5 rounded-lg hover:bg-red-600 transition-all shadow-md hover:shadow-lg font-semibold whitespace-nowrap"
        >
          Logout
        </button>
      </div>
    </div>
    
    <!-- Bottom row: Navigation - Centered -->
    <div class="flex flex-row justify-center gap-4 sm:gap-6 md:gap-8 items-center px-2 sm:px-4 md:px-6 lg:px-8 pb-2 sm:pb-3 md:pb-4">
      <!-- Main Page - Active if on index -->
      <button
        v-if="isActive('/')"
        class="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-lg bg-gray-800 text-white text-sm sm:text-base font-medium transition-all shadow-lg"
        @click="navigateTo('/')"
      >
        Main Page
      </button>
      <button
        v-else
        class="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 text-gray-400 hover:text-gray-300 text-sm sm:text-base font-medium transition-colors cursor-pointer"
        @click="navigateTo('/')"
      >
        Main Page
      </button>
      
      <!-- Add Data - Active if on addData -->
      <button
        v-if="isActive('/addData')"
        class="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-lg bg-gray-800 text-white text-sm sm:text-base font-medium transition-all shadow-lg"
        @click="navigateTo('/addData')"
      >
        Add Data
      </button>
      <button
        v-else
        class="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 text-gray-400 hover:text-gray-300 text-sm sm:text-base font-medium transition-colors cursor-pointer"
        @click="navigateTo('/addData')"
      >
        Add Data
      </button>
    </div>
  </div>
</template>
