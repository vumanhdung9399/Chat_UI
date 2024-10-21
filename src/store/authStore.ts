import { defineStore } from "pinia";
import authService from "@src/services/authService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {
      id: null,
    },
  }),
  actions: {
    async getUser() {
      let res = await authService.getUser();
      this.user = res.data;
    },
    async refreshToken(refreshToken: String) {
        let params = {
            refreshToken: refreshToken
        }
        let res = await authService.refreshToken(params);
        if (res.status === 200) {
            localStorage.setItem("accessToken", res.data.accessToken);
            return true
        } else {
            return false
        }
    }
  },
});
