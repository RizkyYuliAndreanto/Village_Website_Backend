import BaseChildModel from "./BaseChildModel.js";

class DemografiPendudukModel extends BaseChildModel {
  constructor() {
    super("demografi_penduduk", "id_demografi", {
      tahun_id: { table: "tahun_data", key: "id_tahun" },
    });
  }

  // Get gender distribution for specific year
  async getGenderDistributionByYear(tahun) {
    const data = await this.getByYear(tahun);
    if (!data) return null;

    const total = data.total_penduduk;
    if (total === 0) return null;

    return {
      tahun: data.tahun,
      total_population: total,
      gender_distribution: {
        laki_laki: {
          count: data["laki-laki"], // Note: field name has hyphen in DB
          percentage: ((data["laki-laki"] / total) * 100).toFixed(2),
        },
        perempuan: {
          count: data.perempuan,
          percentage: ((data.perempuan / total) * 100).toFixed(2),
        },
      },
      penduduk_sementara: data.penduduk_sementara,
      mutasi_penduduk: data.mutasi_penduduk,
    };
  }

  // Calculate population growth between two years
  async getPopulationGrowthByYears(tahun1, tahun2) {
    const [data1, data2] = await Promise.all([
      this.getByYear(tahun1),
      this.getByYear(tahun2),
    ]);

    if (!data1 || !data2) return null;

    const growth = data2.total_penduduk - data1.total_penduduk;
    const growthPercentage =
      data1.total_penduduk > 0 ? (growth / data1.total_penduduk) * 100 : 0;

    return {
      comparison_years: [tahun1, tahun2],
      population_growth: {
        [tahun1]: {
          total: data1.total_penduduk,
          laki_laki: data1["laki-laki"],
          perempuan: data1.perempuan,
        },
        [tahun2]: {
          total: data2.total_penduduk,
          laki_laki: data2["laki-laki"],
          perempuan: data2.perempuan,
        },
        growth: {
          total: growth,
          laki_laki: data2["laki-laki"] - data1["laki-laki"],
          perempuan: data2.perempuan - data1.perempuan,
        },
        growth_percentage: {
          total: parseFloat(growthPercentage.toFixed(2)),
          laki_laki:
            data1["laki-laki"] > 0
              ? parseFloat(
                  (
                    ((data2["laki-laki"] - data1["laki-laki"]) /
                      data1["laki-laki"]) *
                    100
                  ).toFixed(2)
                )
              : 0,
          perempuan:
            data1.perempuan > 0
              ? parseFloat(
                  (
                    ((data2.perempuan - data1.perempuan) / data1.perempuan) *
                    100
                  ).toFixed(2)
                )
              : 0,
        },
      },
    };
  }

  // Get population density and migration info
  async getPopulationMobilityByYear(tahun) {
    const data = await this.getByYear(tahun);
    if (!data) return null;

    return {
      tahun: data.tahun,
      population_mobility: {
        total_penduduk: data.total_penduduk,
        penduduk_tetap: data.total_penduduk - data.penduduk_sementara,
        penduduk_sementara: data.penduduk_sementara,
        mutasi_penduduk: data.mutasi_penduduk,
        sementara_percentage:
          data.total_penduduk > 0
            ? ((data.penduduk_sementara / data.total_penduduk) * 100).toFixed(2)
            : "0.00",
      },
    };
  }

  // Get comprehensive statistics for all years
  async getAllYearStats() {
    const allData = await this.getAllWithYear();

    const stats = allData.map((data, index) => {
      const baseStats = {
        tahun: data.tahun,
        total_penduduk: data.total_penduduk,
        laki_laki: data["laki-laki"],
        perempuan: data.perempuan,
        penduduk_sementara: data.penduduk_sementara,
        mutasi_penduduk: data.mutasi_penduduk,
        gender_ratio:
          data["laki-laki"] > 0
            ? parseFloat((data.perempuan / data["laki-laki"]).toFixed(2))
            : 0,
      };

      // Calculate growth from previous year if available
      if (index < allData.length - 1) {
        const previousData = allData[index + 1]; // Data is ordered desc by year
        const growth = data.total_penduduk - previousData.total_penduduk;
        const growthPercentage =
          previousData.total_penduduk > 0
            ? (growth / previousData.total_penduduk) * 100
            : 0;

        baseStats.growth_from_previous = {
          absolute: growth,
          percentage: parseFloat(growthPercentage.toFixed(2)),
        };
      }

      return baseStats;
    });

    return stats;
  }

  // Get latest population trends
  async getLatestTrends() {
    const latestData = await this.getLatest();
    if (!latestData) return null;

    // Get previous year data for comparison
    const previousYearData = await this.db(this.tableName)
      .join("tahun_data", `${this.tableName}.tahun_id`, "tahun_data.id_tahun")
      .select(
        `${this.tableName}.*`,
        "tahun_data.tahun",
        "tahun_data.keterangan"
      )
      .where("tahun_data.tahun", "<", latestData.tahun)
      .orderBy("tahun_data.tahun", "desc")
      .first();

    const trends = {
      latest_year: latestData.tahun,
      current_population: latestData.total_penduduk,
      current_gender_distribution: {
        laki_laki: latestData["laki-laki"],
        perempuan: latestData.perempuan,
        ratio:
          latestData["laki-laki"] > 0
            ? parseFloat(
                (latestData.perempuan / latestData["laki-laki"]).toFixed(2)
              )
            : 0,
      },
    };

    if (previousYearData) {
      const growth =
        latestData.total_penduduk - previousYearData.total_penduduk;
      const growthPercentage =
        previousYearData.total_penduduk > 0
          ? (growth / previousYearData.total_penduduk) * 100
          : 0;

      trends.growth_from_previous_year = {
        previous_year: previousYearData.tahun,
        previous_population: previousYearData.total_penduduk,
        growth: growth,
        growth_percentage: parseFloat(growthPercentage.toFixed(2)),
        trend: growth > 0 ? "Naik" : growth < 0 ? "Turun" : "Stabil",
      };
    }

    return trends;
  }

  // Validate demographic data
  validateDemographicData(data) {
    const demographicFields = [
      "total_penduduk",
      "laki_laki",
      "perempuan",
      "penduduk_sementara",
      "mutasi_penduduk",
    ];

    for (const field of demographicFields) {
      if (
        data[field] !== undefined &&
        (data[field] < 0 || !Number.isInteger(data[field]))
      ) {
        return {
          valid: false,
          message: `${field} harus berupa angka bulat non-negatif`,
        };
      }
    }

    // Check if gender sum doesn't exceed total (if all fields are provided)
    if (
      data.total_penduduk !== undefined &&
      data.laki_laki !== undefined &&
      data.perempuan !== undefined
    ) {
      const genderSum = data.laki_laki + data.perempuan;
      if (genderSum > data.total_penduduk) {
        return {
          valid: false,
          message:
            "Jumlah laki-laki dan perempuan tidak boleh melebihi total penduduk",
        };
      }
    }

    return { valid: true };
  }

  // Create with validation
  async createWithValidation(data) {
    const validation = this.validateDemographicData(data);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // Check if tahun_id exists
    const tahunValid = await this.validateTahunId(data.tahun_id);
    if (!tahunValid) {
      throw new Error("Tahun data tidak ditemukan");
    }

    // Check if data already exists for this year
    const exists = await this.existsByTahunId(data.tahun_id);
    if (exists) {
      throw new Error("Data demografi penduduk untuk tahun ini sudah ada");
    }

    // Map field name for database (laki_laki -> laki-laki)
    const dbData = { ...data };
    if (data.laki_laki !== undefined) {
      dbData["laki-laki"] = data.laki_laki;
      delete dbData.laki_laki;
    }

    return await this.create(dbData);
  }

  // Update with validation
  async updateWithValidation(id, data) {
    const validation = this.validateDemographicData(data);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // Check if record exists
    const exists = await this.exists(id);
    if (!exists) {
      throw new Error("Data demografi penduduk tidak ditemukan");
    }

    // If tahun_id is being updated, validate
    if (data.tahun_id) {
      const tahunValid = await this.validateTahunId(data.tahun_id);
      if (!tahunValid) {
        throw new Error("Tahun data tidak ditemukan");
      }

      const duplicateExists = await this.existsByTahunIdExcluding(
        data.tahun_id,
        id
      );
      if (duplicateExists) {
        throw new Error("Data demografi penduduk untuk tahun ini sudah ada");
      }
    }

    // Map field name for database (laki_laki -> laki-laki)
    const dbData = { ...data };
    if (data.laki_laki !== undefined) {
      dbData["laki-laki"] = data.laki_laki;
      delete dbData.laki_laki;
    }

    return await this.update(id, dbData);
  }

  // Check if data exists by tahun_id excluding specific ID (for update validation)
  async existsByTahunIdExcluding(tahunId, excludeId) {
    const result = await this.db(this.tableName)
      .where("tahun_id", tahunId)
      .where(this.primaryKey, "!=", excludeId)
      .first();
    return !!result;
  }

  // Check if data exists by tahun_id
  async existsByTahunId(tahunId) {
    const result = await this.db(this.tableName)
      .where("tahun_id", tahunId)
      .first();
    return !!result;
  }
}

export default DemografiPendudukModel;
