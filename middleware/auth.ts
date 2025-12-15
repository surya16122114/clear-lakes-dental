export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();

  // Allow access to login and signup pages without authentication
  if (to.path === "/login" || to.path === "/signup") {
    return;
  }

  // Redirect to login if not authenticated
  if (!user.value) {
    return navigateTo("/login");
  }
});

