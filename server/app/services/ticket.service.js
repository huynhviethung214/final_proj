const { ObjectId, WriteConcern } = require('mongodb');

class TicketService {
  constructor(client) {
    this.Ticket = client.db().collection('ticket');
  }

  extractTicketData(payload) {
    const data = {
      readerId: payload.readerId,
      bookId: payload.bookId,
      rentDate: payload.rentDate,
      returnDate: payload.returnDate,
      quantity: payload.quantity
    };

    const keysToRemove = Object.keys(data).filter(key => data[key] === undefined);

    for (const key of keysToRemove) {
      delete data[key];
    }
    return data;
  }

  async findAll() {
    const result = await this.Ticket.find({}).toArray();
    return result;
  }

  async findById(id) {
    const result = await this.Ticket.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    });
    return result;
  }

  async findByReaderId(id) {
    const result = await this.Ticket.find({
      readerId: id
    }).toArray();
    return result;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    };

    const update = this.extractTicketData(payload);
    const result = await this.Ticket.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    return result;
  }

  async create(payload) {
    let data = this.extractTicketData(payload);
    const match = await this.Ticket.findOne({
      bookId: data.bookId,
      readerId: data.readerId
    });

    if (match) {
      match.quantity++;
      return await this.Ticket.findOneAndUpdate(
        { _id: ObjectId.isValid(match._id) ? new ObjectId(match._id) : null },
        { $set: match },
        { returnDocument: "after" }
      );
    }

    return await this.Ticket.findOneAndUpdate(
      data, 
      { $set: data },
      { upsert: true, returnDocument: "after" }
    );
  }

  async delete(id) {
    const result = await this.Ticket.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = TicketService;
