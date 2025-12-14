<script setup lang="ts">
import type { DatabaseEntry } from "~/types/database";

// Apply auth middleware to protect this page
definePageMeta({
  middleware: "auth",
});

const user = useSupabaseUser();

// Create dynamic reference to table data
//    Anything inside a 'ref' vue/nuxt will watch for changes and update the DOM
const dataReference = ref<DatabaseEntry[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Fetch data from Supabase via server API
async function fetchData() {
  // Wait for user to be initialized before fetching
  if (!user.value) {
    return;
  }

  try {
    isLoading.value = true;
    error.value = null;
    const retrievedData = await $fetch<DatabaseEntry[]>("/api/fetchData", {
      method: "POST",
      body: {
        table: "entries",
      },
    });

    // Handle response - check if it's an array
    if (Array.isArray(retrievedData)) {
      dataReference.value = retrievedData;
    } else {
      dataReference.value = [];
    }
  } catch (err: any) {
    // Only show error if it's not an auth error (auth errors are handled by middleware)
    if (!err.message?.includes("Auth session") && !err.message?.includes("Unauthorized")) {
      error.value = err.message || "Failed to fetch data";
      dataReference.value = []; // Clear data on error
      console.error("Error fetching data:", err);
    }
  } finally {
    isLoading.value = false;
  }
}

// Wait for user to be ready before fetching
watchEffect(async () => {
  if (user.value) {
    await fetchData();
  }
});
</script>

<template>
  <!-- Example of how to use a reusable component. No import is needed, all components are automatically imported. -->
  <Header />
  <div class="flex flex-col items-center min-h-screen pt-4 pb-8 px-8 bg-[#0a0e27]">
    <div class="w-full max-w-6xl mx-auto">
      <h2 class="text-4xl font-bold mb-6 text-center text-white">Database Entries</h2>
      
      <div v-if="isLoading" class="text-center py-8">
        <p class="text-gray-300">Loading data...</p>
      </div>
      
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-400">Error: {{ error }}</p>
        <button
          @click="fetchData"
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
      
      <div v-else-if="dataReference.length === 0" class="text-center py-8">
        <p class="text-gray-300">No entries yet. Add some data using the "Add Data" page!</p>
      </div>
      
      <div v-else class="flex justify-center w-full">
        <div class="w-full rounded-xl shadow-2xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full bg-white">
              <thead class="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500">
                <tr>
                  <th class="px-3 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-white uppercase tracking-wider whitespace-nowrap">
                    ID
                  </th>
                  <th class="px-3 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-white uppercase tracking-wider whitespace-nowrap">
                    Name
                  </th>
                  <th class="px-3 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-white uppercase tracking-wider whitespace-nowrap">
                    Email
                  </th>
                  <th class="px-3 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-white uppercase tracking-wider">
                    Message
                  </th>
                  <th class="px-3 md:px-4 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-white uppercase tracking-wider whitespace-nowrap">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="(item, index) in dataReference" 
                  :key="item.id" 
                  class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200"
                  :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                >
                  <td class="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-semibold text-gray-800">
                    #{{ item.id }}
                  </td>
                  <td class="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                    <div class="truncate max-w-[150px]" :title="item.name">
                      {{ item.name }}
                    </div>
                  </td>
                  <td class="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-blue-600 hover:text-blue-800">
                    <a :href="`mailto:${item.email}`" class="hover:underline truncate block max-w-[200px]" :title="item.email">{{ item.email }}</a>
                  </td>
                  <td class="px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm text-gray-700">
                    <div class="break-words whitespace-normal leading-relaxed max-w-[400px]">
                      {{ item.message }}
                    </div>
                  </td>
                  <td class="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                    {{ item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
