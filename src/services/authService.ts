import api from "@src/utils/api";

class AuthService {
  async login(params: any) {
    return await api.post("/login", params);
  }
  async register(params: any) {
    return await api.post("/register", params);
  }
  async refreshToken(params: any) {
    return await api.post("/refresh-token", params);
  }
  async logout() {
    return await api.post("/logout");
  }
  async getUser() {
    return await api.get("/user");
  }
}

export default new AuthService();
