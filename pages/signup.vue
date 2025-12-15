<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const nameError = ref<string | null>(null);
const emailError = ref<string | null>(null);
const passwordError = ref<string | null>(null);
const confirmPasswordError = ref<string | null>(null);

// Redirect if already logged in
watchEffect(() => {
  if (user.value && route.path === '/signup') {
    navigateTo("/");
  }
});

// Email validation function - stricter validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Password validation
function isValidPassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: "Your password should be 8-16 characters and include at least one letter and one number" };
  }
  if (password.length > 16) {
    return { valid: false, message: "Your password should be 8-16 characters and include at least one letter and one number" };
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, message: "Your password should be 8-16 characters and include at least one letter and one number" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Your password should be 8-16 characters and include at least one letter and one number" };
  }
  return { valid: true, message: "" };
}

async function handleSignup() {
  // Clear previous errors
  error.value = null;
  success.value = null;
  nameError.value = null;
  emailError.value = null;
  passwordError.value = null;
  confirmPasswordError.value = null;

  // Validation
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = "Please fill in all fields";
    return;
  }
  
  // Name validation
  if (name.value.trim().length < 2) {
    nameError.value = "Your name should be 2-40 characters";
    return;
  }
  if (name.value.length > 40) {
    nameError.value = "Your name should be 2-40 characters";
    return;
  }
  if (!/^[a-zA-Z\s]+$/.test(name.value)) {
    nameError.value = "Name should only contain letters and spaces";
    return;
  }
  
  // Email validation
  if (!isValidEmail(email.value)) {
    emailError.value = "Please enter a valid email address (e.g., user@example.com)";
    return;
  }
  
  // Password validation
  const passwordValidation = isValidPassword(password.value);
  if (!passwordValidation.valid) {
    passwordError.value = passwordValidation.message;
    return;
  }
  
  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = "Passwords do not match";
    return;
  }

  try {
    isLoading.value = true;

    // Get the base URL for email confirmation redirect
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const redirectUrl = `${baseUrl}/auth/confirm`;
    
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: name.value,
          name: name.value,
        }
      }
    });

    if (signUpError) throw signUpError;
    
    // Sign out immediately after signup to prevent auto-login
    await supabase.auth.signOut();
    
    success.value = "Account created successfully! A confirmation email has been sent. Please verify your email to continue.";
    
    // Clear form after successful signup
    name.value = "";
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
    
    // Clear password fields from browser autofill
    nextTick(() => {
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      const confirmInput = document.getElementById('confirmPassword') as HTMLInputElement;
      if (passwordInput) passwordInput.value = '';
      if (confirmInput) confirmInput.value = '';
    });
  } catch (err: any) {
    error.value = err.message || "Signup failed";
    console.error("Signup error:", err);
  } finally {
    isLoading.value = false;
  }
}

// Validation functions for real-time feedback
function validateName() {
  nameError.value = null;
  if (!name.value) return;
  
  if (name.value.trim().length < 2) {
    nameError.value = "Your name should be 2-40 characters";
    return;
  }
  if (name.value.length > 40) {
    nameError.value = "Your name should be 2-40 characters";
    return;
  }
  if (!/^[a-zA-Z\s]+$/.test(name.value)) {
    nameError.value = "Name should only contain letters and spaces (no numbers or special characters)";
    return;
  }
}

function validateEmail() {
  emailError.value = null;
  if (!email.value) return;
  
  if (!isValidEmail(email.value)) {
    emailError.value = "Please enter a valid email address (e.g., user@example.com)";
    return;
  }
}

function validatePassword() {
  passwordError.value = null;
  if (!password.value) return;
  
  if (password.value.length < 8) {
    passwordError.value = "Your password should be 8-16 characters and include at least one letter and one number";
    return;
  }
  if (password.value.length > 16) {
    passwordError.value = "Your password should be 8-16 characters and include at least one letter and one number";
    return;
  }
  if (!/[a-zA-Z]/.test(password.value)) {
    passwordError.value = "Your password should be 8-16 characters and include at least one letter and one number";
    return;
  }
  if (!/[0-9]/.test(password.value)) {
    passwordError.value = "Your password should be 8-16 characters and include at least one letter and one number";
    return;
  }
}

function validateConfirmPassword() {
  confirmPasswordError.value = null;
  if (!confirmPassword.value) return;
  
  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = "Passwords do not match";
    return;
  }
}
</script>

<template>
  <div class="fixed inset-0 overflow-y-auto bg-gradient-to-br from-blue-50 to-green-50">
    <div class="relative flex flex-col items-center justify-center min-h-full p-4 sm:p-6 md:p-8 w-full">
    <!-- Logo at the top -->
    <div class="absolute top-2 sm:top-4 md:top-4 lg:top-6 xl:top-8 left-1/2 transform -translate-x-1/2 z-20">
      <img
        src="/full_logo.png"
        alt="Clear Lakes Dental"
        class="w-24 sm:w-28 md:w-36 lg:w-56 xl:w-64 h-auto mx-auto"
      />
    </div>
    
    <!-- Background decorative elements -->
    <div class="absolute inset-0 flex flex-col items-center justify-center opacity-5 pointer-events-none">
      <div class="w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
      <div class="w-96 h-96 bg-green-200 rounded-full blur-3xl -mt-64"></div>
    </div>

    <!-- Signup Form -->
    <div class="relative w-full max-w-md z-10 mt-[120px] sm:mt-[140px] md:mt-[160px] lg:mt-[180px] xl:mt-[200px] px-4 sm:px-6">
      <div class="bg-white p-5 sm:p-6 md:p-7 lg:p-8 rounded-xl shadow-2xl border border-gray-200 backdrop-blur-sm">
        <div class="text-center mb-6 sm:mb-7 md:mb-8">
          <h2 class="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-1.5 md:mb-2">
            Create Account
          </h2>
          <p class="text-sm sm:text-base text-gray-600">
            Sign up to get started
          </p>
        </div>

        <form @submit.prevent="handleSignup" novalidate class="space-y-5">
          <div>
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              v-model="name"
              placeholder="Enter your full name"
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
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              v-model="email"
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
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
              Password *
            </label>
            <input
              id="password"
              type="password"
              v-model="password"
              placeholder="Enter your password"
              required
              maxlength="16"
              class="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
              :class="passwordError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'"
              @blur="validatePassword"
              @input="passwordError = null"
            />
            <p v-if="passwordError" class="text-xs text-red-600 mt-1">{{ passwordError }}</p>
            <p v-else class="text-xs text-gray-500 mt-1">Your password should be 8-16 characters and include at least one letter and one number</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              type="password"
              v-model="confirmPassword"
              placeholder="Confirm your password"
              required
              maxlength="16"
              class="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
              :class="confirmPasswordError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'"
              @blur="validateConfirmPassword"
              @input="confirmPasswordError = null"
            />
            <p v-if="confirmPasswordError" class="text-xs text-red-600 mt-1">{{ confirmPasswordError }}</p>
          </div>

          <div v-if="error" class="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
            {{ error }}
          </div>

          <div v-if="success" class="bg-green-50 border-2 border-green-300 text-green-700 px-4 py-3 rounded-lg text-sm font-medium">
            {{ success }}
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span v-if="isLoading">Processing...</span>
            <span v-else>Create Account</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <NuxtLink
            to="/login"
            class="text-blue-600 hover:text-blue-700 font-medium underline transition-colors"
          >
            Already have an account? Login
          </NuxtLink>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

