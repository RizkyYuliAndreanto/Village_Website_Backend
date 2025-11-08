import BaseChildModel from "./BaseChildModel.js";

class AgamaStatistikModel extends BaseChildModel {
  constructor() {
    super("agama_statistik", "id_agama", {
      tahun_id: { table: "tahun_data", key: "id_tahun" },
    });
  }

  // Get religion statistics for specific year
  async getReligionsByYear(tahun) {
    const data = await this.getByYear(tahun);
    if (!data) return null;

    return {
      ...data,
      religions: {
        islam: data.islam,
        katolik: data.katolik,
        kristen: data.kristen,
        hindu: data.hindu,
        buddha: data.buddha,
        konghucu: data.konghucu,
        kepercayaan_lain: data.kepercayaan_lain,
      },
    };
  }

  // Calculate total population from religion data
  async getTotalPopulationByYear(tahun) {
    const data = await this.getByYear(tahun);
    if (!data) return 0;

    return (
      data.islam +
      data.katolik +
      data.kristen +
      data.hindu +
      data.buddha +
      data.konghucu +
      data.kepercayaan_lain
    );
  }

  // Get religion distribution (percentage) for specific year
  async getReligionDistributionByYear(tahun) {
    const data = await this.getByYear(tahun);
    if (!data) return null;

    const total = await this.getTotalPopulationByYear(tahun);
    if (total === 0) return null;

    return {
      tahun: data.tahun,
      total_population: total,
      distribution: {
        islam: {
          count: data.islam,
          percentage: ((data.islam / total) * 100).toFixed(2),
        },
        katolik: {
          count: data.katolik,
          percentage: ((data.katolik / total) * 100).toFixed(2),
        },
        kristen: {
          count: data.kristen,
          percentage: ((data.kristen / total) * 100).toFixed(2),
        },
        hindu: {
          count: data.hindu,
          percentage: ((data.hindu / total) * 100).toFixed(2),
        },
        buddha: {
          count: data.buddha,
          percentage: ((data.buddha / total) * 100).toFixed(2),
        },
        konghucu: {
          count: data.konghucu,
          percentage: ((data.konghucu / total) * 100).toFixed(2),
        },
        kepercayaan_lain: {
          count: data.kepercayaan_lain,
          percentage: ((data.kepercayaan_lain / total) * 100).toFixed(2),
        },
      },
    };
  }

  // Get religion comparison between two years
  async compareReligionsByYears(tahun1, tahun2) {
    const [data1, data2] = await Promise.all([
      this.getByYear(tahun1),
      this.getByYear(tahun2),
    ]);

    if (!data1 || !data2) return null;

    const religions = [
      "islam",
      "katolik",
      "kristen",
      "hindu",
      "buddha",
      "konghucu",
      "kepercayaan_lain",
    ];

    const comparison = {};

    religions.forEach((religion) => {
      comparison[religion] = {
        [tahun1]: data1[religion],
        [tahun2]: data2[religion],
        difference: data2[religion] - data1[religion],
        growth_percentage:
          data1[religion] > 0
            ? (
                ((data2[religion] - data1[religion]) / data1[religion]) *
                100
              ).toFixed(2)
            : "N/A",
      };
    });

    return {
      comparison_years: [tahun1, tahun2],
      religion_comparison: comparison,
    };
  }

  // Get dominant religions for specific year
  async getDominantReligionsByYear(tahun) {
    const data = await this.getByYear(tahun);
    if (!data) return null;

    const religions = [
      { name: "Islam", count: data.islam },
      { name: "Katolik", count: data.katolik },
      { name: "Kristen", count: data.kristen },
      { name: "Hindu", count: data.hindu },
      { name: "Buddha", count: data.buddha },
      { name: "Konghucu", count: data.konghucu },
      { name: "Kepercayaan Lain", count: data.kepercayaan_lain },
    ];

    // Sort by count (descending)
    const sortedReligions = religions.sort((a, b) => b.count - a.count);

    // Filter out religions with 0 count
    const activeReligions = sortedReligions.filter(
      (religion) => religion.count > 0
    );

    return {
      tahun: data.tahun,
      total_population:
        data.islam +
        data.katolik +
        data.kristen +
        data.hindu +
        data.buddha +
        data.konghucu +
        data.kepercayaan_lain,
      dominant_religions: activeReligions.slice(0, 3), // Top 3
      all_religions: activeReligions,
      religions_count: activeReligions.length,
    };
  }

  // Get diversity index (how diverse the religious composition is)
  async getReligionDiversityByYear(tahun) {
    const data = await this.getByYear(tahun);
    if (!data) return null;

    const total = await this.getTotalPopulationByYear(tahun);
    if (total === 0) return null;

    const religions = [
      data.islam,
      data.katolik,
      data.kristen,
      data.hindu,
      data.buddha,
      data.konghucu,
      data.kepercayaan_lain,
    ];

    // Calculate Simpson's Diversity Index
    let sumSquaredProportions = 0;
    religions.forEach((count) => {
      if (count > 0) {
        const proportion = count / total;
        sumSquaredProportions += proportion * proportion;
      }
    });

    const diversityIndex = 1 - sumSquaredProportions;
    const activeReligions = religions.filter((count) => count > 0).length;

    return {
      tahun: data.tahun,
      total_population: total,
      diversity_index: parseFloat(diversityIndex.toFixed(4)), // 0 = no diversity, closer to 1 = high diversity
      active_religions_count: activeReligions,
      diversity_level:
        diversityIndex < 0.3
          ? "Rendah"
          : diversityIndex < 0.7
          ? "Sedang"
          : "Tinggi",
    };
  }

  // Get statistics for all years
  async getAllYearStats() {
    const allData = await this.getAllWithYear();

    const stats = allData.map((data) => {
      const total =
        data.islam +
        data.katolik +
        data.kristen +
        data.hindu +
        data.buddha +
        data.konghucu +
        data.kepercayaan_lain;

      const activeReligions = [
        data.islam,
        data.katolik,
        data.kristen,
        data.hindu,
        data.buddha,
        data.konghucu,
        data.kepercayaan_lain,
      ].filter((count) => count > 0).length;

      return {
        tahun: data.tahun,
        total_population: total,
        islam_percentage:
          total > 0 ? ((data.islam / total) * 100).toFixed(2) : "0.00",
        minority_religions_total:
          data.katolik +
          data.kristen +
          data.hindu +
          data.buddha +
          data.konghucu +
          data.kepercayaan_lain,
        active_religions_count: activeReligions,
      };
    });

    return stats;
  }

  // Get minority religions summary for specific year
  async getMinorityReligionsByYear(tahun) {
    const data = await this.getByYear(tahun);
    if (!data) return null;

    const minorityReligions = {
      katolik: data.katolik,
      kristen: data.kristen,
      hindu: data.hindu,
      buddha: data.buddha,
      konghucu: data.konghucu,
      kepercayaan_lain: data.kepercayaan_lain,
    };

    const totalMinority = Object.values(minorityReligions).reduce(
      (sum, count) => sum + count,
      0
    );
    const totalPopulation = await this.getTotalPopulationByYear(tahun);

    return {
      tahun: data.tahun,
      total_population: totalPopulation,
      islam_count: data.islam,
      islam_percentage:
        totalPopulation > 0
          ? ((data.islam / totalPopulation) * 100).toFixed(2)
          : "0.00",
      minority_religions: minorityReligions,
      total_minority: totalMinority,
      minority_percentage:
        totalPopulation > 0
          ? ((totalMinority / totalPopulation) * 100).toFixed(2)
          : "0.00",
    };
  }

  // Validate religion data (ensure all values are non-negative)
  validateReligionData(data) {
    const religionFields = [
      "islam",
      "katolik",
      "kristen",
      "hindu",
      "buddha",
      "konghucu",
      "kepercayaan_lain",
    ];

    for (const field of religionFields) {
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

    return { valid: true };
  }

  // Create with validation
  async createWithValidation(data) {
    const validation = this.validateReligionData(data);
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
      throw new Error("Data agama statistik untuk tahun ini sudah ada");
    }

    return await this.create(data);
  }

  // Update with validation
  async updateWithValidation(id, data) {
    const validation = this.validateReligionData(data);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // Check if record exists
    const exists = await this.exists(id);
    if (!exists) {
      throw new Error("Data agama statistik tidak ditemukan");
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
        throw new Error("Data agama statistik untuk tahun ini sudah ada");
      }
    }

    return await this.update(id, data);
  }
}

export default AgamaStatistikModel;
