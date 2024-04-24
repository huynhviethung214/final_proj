const { ObjectId, WriteConcern } = require('mongodb');

class ReaderService {
  constructor(client) {
    this.Reader = client.db().collection('reader');
  }

  extractReaderData(payload) {
    const data = {
      name: payload.name,
      dateOfBirth: payload.dateOfBirth,
      gender: payload.gender,
      address: payload.address,
      phone: payload.phone,
      accountId: payload.accountId
    };

    const keysToRemove = Object.keys(data).filter(key => data[key] === undefined);

    for (const key of keysToRemove) {
      delete data[key];
    }
    return data;
  }

  async findAll() {
    const result = await this.Reader.find({}).toArray();
    return result;
  }

  async findByName(_name) {
    const result = await this.Reader.find({
      name: {$regex: `${_name}`}
    }).toArray();
    return result;
  }

  async findById(id) {
    const result = await this.Reader.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    });
    return result;
  }

  async findByAccountId(_accountId) {
    const result = await this.Reader.findOne({
      accountId: _accountId
    });
    return result;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    };

    const update = this.extractReaderData(payload);
    const result = await this.Reader.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    return result;
  }

  async create(payload) {
    const data = this.extractReaderData(payload);
    const result = await this.Reader.findOneAndUpdate(
      data, 
      { $set: data },
      {
        upsert: true, returnDocument: "after"
      }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Reader.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = ReaderService;
