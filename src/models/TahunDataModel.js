import BaseModel from "./BaseModel.js";

class TahunDataModel extends BaseModel {
  constructor() {
    super("tahun_data", "id_tahun");
  }

  // Get year by year value
  async findByYear(year) {
    return await this.findOneWhere({ tahun: year });
  }

  // Check if year exists
  async yearExists(year) {
    return await this.exists({ tahun: year });
  }

  // Check if year exists excluding specific ID (for update validation)
  async yearExistsExcluding(year, excludeId) {
    const result = await this.db(this.tableName)
      .where("tahun", year)
      .where(this.primaryKey, "!=", excludeId)
      .count("* as total")
      .first();
    return parseInt(result.total) > 0;
  }

  // Get all years ordered by year descending
  async findAllOrdered() {
    return await this.db(this.tableName).select("*").orderBy("tahun", "desc");
  }

  // Get latest year
  async getLatestYear() {
    return await this.db(this.tableName).orderBy("tahun", "desc").first();
  }

  // Get previous year from a specific year
  async getPreviousYear(year) {
    return await this.db(this.tableName)
      .where("tahun", "<", year)
      .orderBy("tahun", "desc")
      .first();
  }

  // Get next year from a specific year
  async getNextYear(year) {
    return await this.db(this.tableName)
      .where("tahun", ">", year)
      .orderBy("tahun", "asc")
      .first();
  }

  // Get years range
  async getYearsInRange(startYear, endYear) {
    return await this.db(this.tableName)
      .where("tahun", ">=", startYear)
      .where("tahun", "<=", endYear)
      .orderBy("tahun", "asc");
  }

  // Get years with statistics (how many related records per year)
  async findAllWithStats() {
    return await this.db(this.tableName)
      .leftJoin(
        "demografi_penduduk",
        `${this.tableName}.${this.primaryKey}`,
        "demografi_penduduk.tahun_id"
      )
      .select(
        `${this.tableName}.*`,
        this.db.raw("COUNT(demografi_penduduk.id_demografi) as demografi_count")
      )
      .groupBy(`${this.tableName}.${this.primaryKey}`)
      .orderBy(`${this.tableName}.tahun`, "desc");
  }

  // Get min and max years with count
  async getYearsRange() {
    const minMax = await this.db(this.tableName)
      .select(
        this.db.raw("MIN(tahun) as min_year"),
        this.db.raw("MAX(tahun) as max_year"),
        this.db.raw("COUNT(*) as total_years")
      )
      .first();

    const yearsList = await this.db(this.tableName)
      .select("tahun")
      .orderBy("tahun", "asc")
      .pluck("tahun");

    return {
      min_year: minMax.min_year,
      max_year: minMax.max_year,
      total_years: parseInt(minMax.total_years),
      available_years: yearsList,
    };
  }

  // Check if tahun is referenced by other tables
  async isReferencedInDemografi(tahunId) {
    const result = await this.db("demografi_penduduk")
      .where("tahun_id", tahunId)
      .count("* as total")
      .first();
    return parseInt(result.total) > 0;
  }

  // Get all references for a tahun
  async getReferences(tahunId) {
    const demografiCount = await this.db("demografi_penduduk")
      .where("tahun_id", tahunId)
      .count("* as total")
      .first();

    // You can add more table checks here as your app grows
    // const otherTableCount = await this.db("other_table")
    //   .where("tahun_id", tahunId)
    //   .count("* as total")
    //   .first();

    return {
      demografi_penduduk: parseInt(demografiCount.total),
      // other_table: parseInt(otherTableCount.total),
      total: parseInt(demografiCount.total),
    };
  }

  // Safe delete - only delete if not referenced
  async safeDeleteById(id) {
    const isReferenced = await this.isReferencedInDemografi(id);

    if (isReferenced) {
      throw new Error(
        "Data tahun tidak dapat dihapus karena masih digunakan di tabel lain"
      );
    }

    return await this.deleteById(id);
  }
}

export default TahunDataModel;
