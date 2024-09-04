const { ObjectId } = require("mongodb");
const { db } = require("../config/mongodb");

class User {
  static col() {
    return db.collection("user");
  }

  static async findAll() {
    const result = await this.col().find().toArray();
    return result;
  }

  static async create(newUser) {
    const result = await this.col().insertOne(newUser);
    return {
      ...newUser,
      _id: result.insertedId,
    };
  }

  static async findByPK(UserId) {
    const result = await this.col().findOne({ _id: new ObjectId(UserId) });
    return result;
  }

  static async findByUsername(username) {
    const result = await this.col().findOne({ username: username });
    return result;
  }
}

module.exports = User;
