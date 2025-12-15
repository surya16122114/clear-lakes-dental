<script setup lang="ts">
import type { DatabaseEntry } from "~/types/database";

// Apply auth middleware to protect this page
definePageMeta({
  middleware: "auth",
});

// Using a reactive form state to handle user input
const formState = reactive<Omit<DatabaseEntry, "id" | "created_at">>({
  name: "",
  email: "",
  message: "",
});

const isSubmitting = ref(false);
const submitError = ref<string | null>(null);
const submitSuccess = ref(false);
const nameError = ref<string | null>(null);
const emailError = ref<string | null>(null);
const messageError = ref<string | null>(null);

// Email validation function - stricter validation
function isValidEmail(email: string): boolean {
  // Must have @ and a domain with at least one dot and TLD
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Validation functions for real-time feedback
function validateName() {
  nameError.value = null;
  if (!formState.name) return;
  
  if (formState.name.trim().length < 2) {
    nameError.value = "Your name should be 2-40 characters";
    return;
  }
  if (formState.name.length > 40) {
    nameError.value = "Your name should be 2-40 characters";
    return;
  }
  if (!/^[a-zA-Z\s]+$/.test(formState.name)) {
    nameError.value = "Name should only contain letters and spaces (no numbers or special characters)";
    return;
  }
}

function validateEmail() {
  emailError.value = null;
  if (!formState.email) return;
  
  if (!isValidEmail(formState.email)) {
    emailError.value = "Please enter a valid email address (e.g., user@example.com)";
    return;
  }
}

function validateMessage() {
  messageError.value = null;
  if (!formState.message) return;
  
  if (formState.message.length > 1000) {
    messageError.value = "Message must be less than 1000 characters";
    return;
  }
}

// Submit form data to Supabase via server API
async function submitForm() {
  if (!formState.name || !formState.email || !formState.message) {
    submitError.value = "Please fill in all required fields (Name, Email, Message)";
    return;
  }

  // Name validation
  if (formState.name.trim().length < 2) {
    submitError.value = "Your name should be 2-40 characters";
    return;
  }
  if (formState.name.length > 40) {
    submitError.value = "Your name should be 2-40 characters";
    return;
  }
  // Only letters and spaces allowed
  if (!/^[a-zA-Z\s]+$/.test(formState.name)) {
    submitError.value = "Name should only contain letters and spaces";
    return;
  }

  // Validate email format
  if (!isValidEmail(formState.email)) {
    submitError.value = "Please enter a valid email address (e.g., user@example.com)";
    return;
  }
  
  // Message validation
  if (formState.message.length > 1000) {
    submitError.value = "Message must be less than 1000 characters";
    return;
  }

  try {
    isSubmitting.value = true;
    submitError.value = null;
    submitSuccess.value = false;

    await $fetch("/api/postData", {
      method: "POST",
      body: formState,
    });

    // Reset form on success
    formState.name = "";
    formState.email = "";
    formState.message = "";
    submitSuccess.value = true;

    // Clear success message after 3 seconds
    setTimeout(() => {
      submitSuccess.value = false;
    }, 3000);
  } catch (err: any) {
    submitError.value = err.message || "Failed to submit data";
    console.error("Error submitting data:", err);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <Header />
  <div class="flex flex-col items-center min-h-screen pt-2 sm:pt-4 pb-4 sm:pb-8 px-2 sm:px-4 md:px-6 lg:px-8 bg-[#0a0e27]">
    <div class="w-full max-w-2xl">
      <div class="text-center mb-4 sm:mb-6 px-2">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">Add New Entry</h2>
        <p class="text-sm sm:text-base text-gray-300">Fill in the form below to add a new database entry</p>
      </div>
      
      <div class="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl border-2 border-gray-200">
        <form @submit.prevent="submitForm" novalidate class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
              Name *
            </label>
            <input
              id="name"
              type="text"
              v-model="formState.name"
              placeholder="Enter your name"
              required
              maxlength="40"
              class="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
              :class="nameError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'"
              @blur="validateName"
              @input="nameError = null"
            />
            <p v-if="nameError" class="text-xs text-red-600 mt-1">{{ nameError }}</p>
            <p v-else class="text-xs text-gray-500 mt-1">Your name should be 2-40 characters (letters and spaces only)</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
              Email *
            </label>
            <input
              id="email"
              type="email"
              v-model="formState.email"
              placeholder="Enter your email (e.g., user@example.com)"
              required
              class="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
              :class="emailError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'"
              @blur="validateEmail"
              @input="emailError = null"
            />
            <p v-if="emailError" class="text-xs text-red-600 mt-1">{{ emailError }}</p>
          </div>

          <div>
            <label for="message" class="block text-sm font-semibold text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              v-model="formState.message"
              placeholder="Enter your message"
              required
              rows="5"
              maxlength="1000"
              class="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none"
              :class="messageError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'"
              @blur="validateMessage"
              @input="messageError = null"
            ></textarea>
            <p v-if="messageError" class="text-xs text-red-600 mt-1">{{ messageError }}</p>
            <p v-else class="text-xs text-gray-500 mt-1">Maximum 1000 characters</p>
          </div>

          <div v-if="submitError" class="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
            {{ submitError }}
          </div>

          <div v-if="submitSuccess" class="bg-green-50 border-2 border-green-300 text-green-700 px-4 py-3 rounded-lg text-sm font-medium">
            ✓ Entry added successfully!
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span v-if="isSubmitting">Submitting...</span>
            <span v-else>Submit Entry</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
