import { db } from "../../config/database.js";

class BaseChildModel {
  constructor(tableName, primaryKey, foreignKeys = {}) {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
    this.foreignKeys = foreignKeys;
    this.db = db;

    // Tentukan nama kolom timestamp berdasarkan tabel
    // Tabel lama menggunakan 'created_at', tabel baru menggunakan 'create_at'
    const tablesWithCreatedAt = [
      "users",
      "refresh_tokens",
      "dusuns",
      "rts",
      "masyarakats",
      "tahun_data",
      "umur_statistik", // Migrasi ini menggunakan created_at
    ];

    // --- PERBAIKAN DI SINI ---
    // Daftar ini diperbarui agar sesuai dengan SEMUA file migrasi Anda
    const tablesWithCreateAt = [
      "demografi_penduduk",
      "agama_statistik",
      "pekerjaan_statistik",
      "pendidikan_statistik",
      "perkawinan_statistik",
      "wajib_pilih_statistik",
    ];
    // -------------------------

    if (tablesWithCreatedAt.includes(tableName)) {
      this.createdAtColumn = "created_at";
    } else if (tablesWithCreateAt.includes(tableName)) {
      this.createdAtColumn = "create_at";
    } else {
      // Default fallback
      this.createdAtColumn = "create_at";
    }

    this.updatedAtColumn = "updated_at";
  }

  // Get all records with year information
  async getAllWithYear() {
    return await this.db(this.tableName)
      .join("tahun_data", `${this.tableName}.tahun_id`, "tahun_data.id_tahun")
      .select(
        `${this.tableName}.*`,
        "tahun_data.tahun",
        "tahun_data.keterangan"
      )
      .orderBy("tahun_data.tahun", "desc");
  }

  // Get all records without joins
  async getAll() {
    return await this.db(this.tableName).select("*").orderBy(this.primaryKey);
  }

  // Get record by ID with year information
  async getByIdWithYear(id) {
    return await this.db(this.tableName)
      .join("tahun_data", `${this.tableName}.tahun_id`, "tahun_data.id_tahun")
      .select(
        `${this.tableName}.*`,
        "tahun_data.tahun",
        "tahun_data.keterangan"
      )
      .where(`${this.tableName}.${this.primaryKey}`, id)
      .first();
  }

  // Get record by ID
  async getById(id) {
    return await this.db(this.tableName).where(this.primaryKey, id).first();
  }

  // Get record by year
  async getByYear(tahun) {
    return await this.db(this.tableName)
      .join("tahun_data", `${this.tableName}.tahun_id`, "tahun_data.id_tahun")
      .select(
        `${this.tableName}.*`,
        "tahun_data.tahun",
        "tahun_data.keterangan"
      )
      .where("tahun_data.tahun", tahun)
      .first();
  }

  // Get record by tahun_id
  async getByTahunId(tahunId) {
    return await this.db(this.tableName).where("tahun_id", tahunId).first();
  }

  // Create new record
  async create(data) {
    const insertData = {
      ...data,
      [this.createdAtColumn]: this.db.fn.now(),
      [this.updatedAtColumn]: this.db.fn.now(),
    };

    const [id] = await this.db(this.tableName)
      .insert(insertData)
      .returning(this.primaryKey);

    return await this.getByIdWithYear(id);
  }

  // Update record
  async update(id, data) {
    const updateData = {
      ...data,
      [this.updatedAtColumn]: this.db.fn.now(),
    };

    await this.db(this.tableName).where(this.primaryKey, id).update(updateData);

    return await this.getByIdWithYear(id);
  }

  // Delete record
  async delete(id) {
    return await this.db(this.tableName).where(this.primaryKey, id).del();
  }

  // Check if record exists by ID
  async exists(id) {
    const result = await this.db(this.tableName)
      .where(this.primaryKey, id)
      .count("* as count")
      .first();
    return parseInt(result.count) > 0;
  }

  // Check if record exists by tahun_id
  async existsByTahunId(tahunId) {
    const result = await this.db(this.tableName)
      .where("tahun_id", tahunId)
      .count("* as count")
      .first();
    return parseInt(result.count) > 0;
  }

  // Check if record exists by tahun_id excluding specific ID
  async existsByTahunIdExcluding(tahunId, excludeId) {
    const result = await this.db(this.tableName)
      .where("tahun_id", tahunId)
      .where(this.primaryKey, "!=", excludeId)
      .count("* as count")
      .first();
    return parseInt(result.count) > 0;
  }

  // Validate if tahun_id exists in tahun_data table
  async validateTahunId(tahunId) {
    const result = await this.db("tahun_data")
      .where("id_tahun", tahunId)
      .count("* as count")
      .first();
    return parseInt(result.count) > 0;
  }

  // Get count of all records
  async count() {
    const result = await this.db(this.tableName).count("* as count").first();
    return parseInt(result.count);
  }

  // Get latest record by year
  async getLatest() {
    return await this.db(this.tableName)
      .join("tahun_data", `${this.tableName}.tahun_id`, "tahun_data.id_tahun")
      .select(
        `${this.tableName}.*`,
        "tahun_data.tahun",
        "tahun_data.keterangan"
      )
      .orderBy("tahun_data.tahun", "desc")
      .first();
  }

  // Get records for specific years (array of years)
  async getByYears(years) {
    return await this.db(this.tableName)
      .join("tahun_data", `${this.tableName}.tahun_id`, "tahun_data.id_tahun")
      .select(
        `${this.tableName}.*`,
        "tahun_data.tahun",
        "tahun_data.keterangan"
      )
      .whereIn("tahun_data.tahun", years)
      .orderBy("tahun_data.tahun", "desc");
  }

  // Get records within year range
  async getByYearRange(startYear, endYear) {
    return await this.db(this.tableName)
      .join("tahun_data", `${this.tableName}.tahun_id`, "tahun_data.id_tahun")
      .select(
        `${this.tableName}.*`,
        "tahun_data.tahun",
        "tahun_data.keterangan"
      )
      .where("tahun_data.tahun", ">=", startYear)
      .where("tahun_data.tahun", "<=", endYear)
      .orderBy("tahun_data.tahun", "desc");
  }

  // Get basic statistics
  async getBasicStats() {
    const totalRecords = await this.count();
    const latestRecord = await this.getLatest();

    const yearStats = await this.db(this.tableName)
      .join("tahun_data", `${this.tableName}.tahun_id`, "tahun_data.id_tahun")
      .select("tahun_data.tahun")
      .count("* as count")
      .groupBy("tahun_data.tahun", "tahun_data.id_tahun")
      .orderBy("tahun_data.tahun", "desc");

    return {
      total_records: totalRecords,
      latest_record: latestRecord,
      yearly_distribution: yearStats,
    };
  }
}

export default BaseChildModel;