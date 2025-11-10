import { db } from "../../config/database.js";

class BaseModel {
  constructor(tableName, primaryKey = "id") {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
    this.db = db;
  }

  // Get all records
  async findAll(columns = "*") {
    return await this.db(this.tableName).select(columns);
  }

  // Get record by ID
  async findById(id, columns = "*") {
    return await this.db(this.tableName)
      .select(columns)
      .where(this.primaryKey, id)
      .first();
  }

  // Get records with conditions
  async findWhere(conditions, columns = "*") {
    return await this.db(this.tableName).select(columns).where(conditions);
  }

  // Get single record with conditions
  async findOneWhere(conditions, columns = "*") {
    return await this.db(this.tableName)
      .select(columns)
      .where(conditions)
      .first();
  }

  // Create new record
  async create(data) {
    const [id] = await this.db(this.tableName)
      .insert({
        ...data,
        created_at: this.db.fn.now(),
        updated_at: this.db.fn.now(),
      })
      .returning(this.primaryKey);

    return await this.findById(id);
  }

  // Update record by ID
  async updateById(id, data) {
    await this.db(this.tableName)
      .where(this.primaryKey, id)
      .update({
        ...data,
        updated_at: this.db.fn.now(),
      });

    return await this.findById(id);
  }

  // Update records with conditions
  async updateWhere(conditions, data) {
    return await this.db(this.tableName)
      .where(conditions)
      .update({
        ...data,
        updated_at: this.db.fn.now(),
      });
  }

  // Delete record by ID
  async deleteById(id) {
    return await this.db(this.tableName).where(this.primaryKey, id).del();
  }

  // Delete records with conditions
  async deleteWhere(conditions) {
    return await this.db(this.tableName).where(conditions).del();
  }

  // Count records
  async count(conditions = {}) {
    const result = await this.db(this.tableName)
      .where(conditions)
      .count("* as total")
      .first();
    return parseInt(result.total);
  }

  // Check if record exists
  async exists(conditions) {
    const count = await this.count(conditions);
    return count > 0;
  }
}

export default BaseModel;
