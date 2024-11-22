import api from "@src/utils/api";

class ContactService {
  async list() {
    return await api.get("/contact/list");
  }
  async listSend() {
    return await api.get("/contact/list-send");
  }
  async listWaitConf() {
    return await api.get("/contact/list-wait-conf");
  }
  async add(params: any) {
    return await api.post("/contact/add", params);
  }
  async delete(params: any) {
    return await api.post("/contact/delete", params);
  }
  async approveFriend(params: any) {
    return await api.post("/contact/approve-friend", params);
  }
}

export default new ContactService();
