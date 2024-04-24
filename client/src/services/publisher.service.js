import createApiClient from "./api.service";

class PublisherService {
  constructor(baseUrl = "/api/pub") {
    this.api = createApiClient(baseUrl);
  }
  async getAll() {
    return (await this.api.get("/")).data;
  }
  async getByName(name) {
    return (await this.api.get(`/name/${name}`)).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async create(data) {
    return (await this.api.post("/", data)).data;
  }
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new PublisherService();
