export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();

  // Allow access to login page without authentication
  if (to.path === "/login") {
    return;
  }

  // Redirect to login if not authenticated
  if (!user.value) {
    return navigateTo("/login");
  }
});

