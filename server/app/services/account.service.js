const { ObjectId } = require('mongodb');

class AccountService {
  constructor(client) {
    this.Account = client.db().collection('account');
  }

  extractAccountData(payload) {
    const data = {
      username: payload.username,
      password: payload.password,
      role: payload.role
    };

    const keysToRemove = Object.keys(data).filter(key => data[key] === undefined);

    for (const key of keysToRemove) {
      delete data[key];
    }
    return data;
  }

  async findAll() {
    const result = await this.Account.find({}).toArray();
    return result;
  }

  async login(payload) {
    const data = this.extractAccountData(payload);
    const result = await this.Account.findOne({
      username: data.username,
      password: data.password
    });
    return result;
  }

  async findById(id) {
    const result = await this.Account.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    });
    return result;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    };

    const update = this.extractAccountData(payload);
    const result = await this.Account.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    return result;
  }

  async create(payload) {
    const data = this.extractAccountData(payload);
    const matches = await this.Account
      .find({ username: data.username })
      .toArray();

    if (matches.length == 0) {
      return await this.Account.findOneAndUpdate(
        data, 
        { $set: data },
        {
          upsert: true, returnDocument: "after"
        }
      );
    };
    return { username: null };
  }

  async delete(id) {
    const result = await this.Account.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }
}

module.exports = AccountService;
