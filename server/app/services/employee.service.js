const { ObjectId } = require('mongodb');

class EmployeeService {
  constructor(client) {
    this.Employee = client.db().collection('employee');
  }

  extractEmployeeData(payload) {
    const data = {
      name: payload.name,
      role: payload.role,
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
    const result = await this.Employee.find({}).toArray();
    return result;
  }

  async findByName(_name) {
    const result = await this.Employee.find({
      name: {$regex: `${_name}`}
    }).toArray();
    return result;
  }

  async findById(id) {
    const result = await this.Employee.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    });
    return result;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null
    };

    const update = this.extractEmployeeData(payload);
    const result = await this.Employee.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    return result;
  }

  async create(payload) {
    const data = this.extractEmployeeData(payload);
    const result = await this.Employee.findOneAndUpdate(
      data, 
      { $set: data },
      {
        upsert: true, returnDocument: "after"
      }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Employee.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = EmployeeService;
