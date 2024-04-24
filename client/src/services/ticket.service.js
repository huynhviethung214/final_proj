import createApiClient from "./api.service";

class TicketService {
  constructor(baseUrl = "/api/ticket") {
    this.api = createApiClient(baseUrl);
  }
  async getAll() {
    return (await this.api.get("/")).data;
  }
  async getByReaderId(readerId) {
    return (await this.api.get(`/reader/${readerId}`)).data;
  }
  async create(data) {
    return (await this.api.post("/", data)).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new TicketService();
