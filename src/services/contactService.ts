import api from "@src/utils/api";

class ContactService {
  async list() {
    return await api.get("/contact/list");
  }
  async add(params: any) {
    return await api.post("/contact/add", params);
  }
  async delete(params: any) {
    return await api.post("/contact/delete", params);
  }
}

export default new ContactService();
