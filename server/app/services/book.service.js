const { ObjectId } = require('mongodb');

class BookService {
  constructor(client) {
    this.Book = client.db().collection('book');
  }

  extractBookData(payload) {
    const data = {
      name: payload.name,
      price: payload.price,
      quantity: payload.quantity,
      releaseDate: payload.releaseDate,
      publisherId: payload.publisherId,
      author: payload.author
    };

    const keysToRemove = Object.keys(data).filter(key => data[key] === undefined);

    for (const key of keysToRemove) {
      delete data[key];
    }
    return data;
  }

  async findAll() {
    const result = await this.Book.find({}).toArray();
    return result;
  }

  async findByName(_name) {
    const result = await this.Book.find({
      name: {$regex: `${_name}`}
    }).toArray();
    return result;
  }

  async findById(id) {
    const result = await this.Book.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    });
    return result;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    };

    const data = this.extractBookData(payload);
    const result = await this.Book.findOneAndUpdate(
      filter,
      { $set: data },
      { returnDocument: "after" }
    );
    return result;
  }

  async create(payload) {
    const data = this.extractBookData(payload);
    const result = await this.Book.findOneAndUpdate(
      data, 
      { $set: data },
      {
        upsert: true, returnDocument: "after"
      }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Book.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = BookService;
