export default class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findAll(query = {}) {
    return await this.model.findAll(query);
  }

  async findOne(query = {}) {
    return await this.model.findOne(query);
  }

  async findById(id) {
    return await this.model.findByPk(id);
  }

  async findOrCreate(query = {}) {
    const [create, created] = await this.model.findOrCreate(query);
    return [create, created];
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    return await this.model.update(data, { where: { id } });
  }

  async delete(query) {
    return await this.model.destroy(query);
  }
};