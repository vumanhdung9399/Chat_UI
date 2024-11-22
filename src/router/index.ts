import { createRouter, createWebHistory } from "vue-router";
import AccessView from "@src/components/views/AccessView/AccessView.vue";
import HomeView from "@src/components/views/HomeView/HomeView.vue";
import PasswordResetView from "@src/components/views/PasswordResetView/PasswordResetView.vue";
import { useAuthStore } from "@src/store/authStore";
import { isTokenExpired } from "@src/utils/helper";
import { useContactStore } from "@src/store/contactStore";

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomeView,
  },
  {
    path: "/login",
    name: "Login",
    component: AccessView,
  },
  {
    path: "/register",
    name: "Register",
    component: AccessView,
  },
  {
    path: "/reset/",
    name: "Password Reset",
    component: PasswordResetView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  const contactStore = useContactStore();
  if (!["Login", "Register"].includes(String(to.name))) {
    if (!localStorage.getItem("accessToken")) {
      return { name: "Login" };
    }
    
    if (isTokenExpired()) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        return { name: "Login" };
      }
      let res = await authStore.refreshToken(
        JSON.stringify(localStorage.getItem("refreshToken"))
      );
      if (!res) {
        return { name: "Login" };
      }
    }

    if (!authStore.user.id) {
      try {
        await authStore.getUser();
        await contactStore.getContact();
        await contactStore.getContactSend();
        await contactStore.getContactWaitConf();
      } catch (err) {
        return { name: "Login" };
      }
    }
  } else {
    if (!isTokenExpired()) {
      return { name: "HomePage" };
    }
  }
});

export default router;
