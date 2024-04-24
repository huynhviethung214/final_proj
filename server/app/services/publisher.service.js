const { ObjectId, WriteConcern } = require('mongodb');

class PublisherService {
  constructor(client) {
    this.Publisher = client.db().collection('publisher');
  }

  extractPublisherData(payload) {
    const data = {
      name: payload.name,
      address: payload.address
    };

    const keysToRemove = Object.keys(data).filter(key => data[key] === undefined);

    for (const key of keysToRemove) {
      delete data[key];
    }
    return data;
  }

  async findAll() {
    const result = await this.Publisher.find({}).toArray();
    return result;
  }

  async findByName(_name) {
    const result = await this.Publisher.findOne({
      name: {$regex: `${_name}`}
    });
    return result;
  }

  async findByPublisherId(pubId) {
    const result = await this.Publisher.findOne({
      publisherId: ObjectId.isValid(pubId) ? new ObjectId(pubId) : null
    });
    return result;
  }

  async findById(id) {
    const result = await this.Publisher.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    });
    return result;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    };

    const update = this.extractPublisherData(payload);
    const result = await this.Publisher.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    return result;
  }

  async create(payload) {
    const data = this.extractPublisherData(payload);
    const result = await this.Publisher.findOneAndUpdate(
      data, 
      { $set: data },
      {
        upsert: true, returnDocument: "after"
      }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Publisher.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = PublisherService;
