import BaseChildModel from "./BaseChildModel.js";

class UmurStatistikModel extends BaseChildModel {
  constructor() {
    super("umur_statistik", "id_umur", {
      tahun_id: { table: "tahun_data", key: "id_tahun" },
    });
  }

  // Get age group statistics for specific year
  async getAgeGroupsByYear(tahun) {
    const data = await this.getByYear(tahun);
    if (!data) return null;

    return {
      ...data,
      age_groups: {
        "0-4": data.umur_0_4,
        "5-9": data.umur_5_9,
        "10-14": data.umur_10_14,
        "15-19": data.umur_15_19,
        "20-24": data.umur_20_24,
        "25-29": data.umur_25_29,
        "30-34": data.umur_30_34,
        "35-39": data.umur_35_39,
        "40-44": data.umur_40_44,
        "45-49": data.umur_45_49,
        "50+": data.umur_50_plus,
      },
    };
  }

  // Calculate total population from age groups
  async getTotalPopulationByYear(tahun) {
    const data = await this.getByYear(tahun);
    if (!data) return 0;

    return (
      data.umur_0_4 +
      data.umur_5_9 +
      data.umur_10_14 +
      data.umur_15_19 +
      data.umur_20_24 +
      data.umur_25_29 +
      data.umur_30_34 +
      data.umur_35_39 +
      data.umur_40_44 +
      data.umur_45_49 +
      data.umur_50_plus
    );
  }

  // Get age distribution (percentage) for specific year
  async getAgeDistributionByYear(tahun) {
    const data = await this.getByYear(tahun);
    if (!data) return null;

    const total = await this.getTotalPopulationByYear(tahun);
    if (total === 0) return null;

    return {
      tahun: data.tahun,
      total_population: total,
      distribution: {
        "0-4": {
          count: data.umur_0_4,
          percentage: ((data.umur_0_4 / total) * 100).toFixed(2),
        },
        "5-9": {
          count: data.umur_5_9,
          percentage: ((data.umur_5_9 / total) * 100).toFixed(2),
        },
        "10-14": {
          count: data.umur_10_14,
          percentage: ((data.umur_10_14 / total) * 100).toFixed(2),
        },
        "15-19": {
          count: data.umur_15_19,
          percentage: ((data.umur_15_19 / total) * 100).toFixed(2),
        },
        "20-24": {
          count: data.umur_20_24,
          percentage: ((data.umur_20_24 / total) * 100).toFixed(2),
        },
        "25-29": {
          count: data.umur_25_29,
          percentage: ((data.umur_25_29 / total) * 100).toFixed(2),
        },
        "30-34": {
          count: data.umur_30_34,
          percentage: ((data.umur_30_34 / total) * 100).toFixed(2),
        },
        "35-39": {
          count: data.umur_35_39,
          percentage: ((data.umur_35_39 / total) * 100).toFixed(2),
        },
        "40-44": {
          count: data.umur_40_44,
          percentage: ((data.umur_40_44 / total) * 100).toFixed(2),
        },
        "45-49": {
          count: data.umur_45_49,
          percentage: ((data.umur_45_49 / total) * 100).toFixed(2),
        },
        "50+": {
          count: data.umur_50_plus,
          percentage: ((data.umur_50_plus / total) * 100).toFixed(2),
        },
      },
    };
  }

  // Get age group comparison between two years
  async compareAgeGroupsByYears(tahun1, tahun2) {
    const [data1, data2] = await Promise.all([
      this.getByYear(tahun1),
      this.getByYear(tahun2),
    ]);

    if (!data1 || !data2) return null;

    const ageGroups = [
      "umur_0_4",
      "umur_5_9",
      "umur_10_14",
      "umur_15_19",
      "umur_20_24",
      "umur_25_29",
      "umur_30_34",
      "umur_35_39",
      "umur_40_44",
      "umur_45_49",
      "umur_50_plus",
    ];

    const comparison = {};

    ageGroups.forEach((group) => {
      const groupLabel = group.replace("umur_", "").replace("_", "-");
      const finalLabel = groupLabel === "50-plus" ? "50+" : groupLabel;

      comparison[finalLabel] = {
        [tahun1]: data1[group],
        [tahun2]: data2[group],
        difference: data2[group] - data1[group],
        growth_percentage:
          data1[group] > 0
            ? (((data2[group] - data1[group]) / data1[group]) * 100).toFixed(2)
            : "N/A",
      };
    });

    return {
      comparison_years: [tahun1, tahun2],
      age_group_comparison: comparison,
    };
  }

  // Get dominant age groups for specific year
  async getDominantAgeGroupsByYear(tahun) {
    const data = await this.getByYear(tahun);
    if (!data) return null;

    const ageGroups = [
      { label: "0-4", value: data.umur_0_4 },
      { label: "5-9", value: data.umur_5_9 },
      { label: "10-14", value: data.umur_10_14 },
      { label: "15-19", value: data.umur_15_19 },
      { label: "20-24", value: data.umur_20_24 },
      { label: "25-29", value: data.umur_25_29 },
      { label: "30-34", value: data.umur_30_34 },
      { label: "35-39", value: data.umur_35_39 },
      { label: "40-44", value: data.umur_40_44 },
      { label: "45-49", value: data.umur_45_49 },
      { label: "50+", value: data.umur_50_plus },
    ];

    // Sort by population count (descending)
    const sortedGroups = ageGroups.sort((a, b) => b.value - a.value);

    return {
      tahun: data.tahun,
      dominant_groups: sortedGroups.slice(0, 3), // Top 3
      least_groups: sortedGroups.slice(-3).reverse(), // Bottom 3
    };
  }

  // Get statistics for all years
  async getAllYearStats() {
    const allData = await this.getAllWithYear();

    const stats = allData.map((data) => ({
      tahun: data.tahun,
      total_population:
        data.umur_0_4 +
        data.umur_5_9 +
        data.umur_10_14 +
        data.umur_15_19 +
        data.umur_20_24 +
        data.umur_25_29 +
        data.umur_30_34 +
        data.umur_35_39 +
        data.umur_40_44 +
        data.umur_45_49 +
        data.umur_50_plus,
      child_population: data.umur_0_4 + data.umur_5_9 + data.umur_10_14, // 0-14
      working_age_population:
        data.umur_15_19 +
        data.umur_20_24 +
        data.umur_25_29 +
        data.umur_30_34 +
        data.umur_35_39 +
        data.umur_40_44 +
        data.umur_45_49, // 15-49
      elderly_population: data.umur_50_plus, // 50+
    }));

    return stats;
  }

  // Validate age group data (ensure all values are non-negative)
  validateAgeGroupData(data) {
    const ageFields = [
      "umur_0_4",
      "umur_5_9",
      "umur_10_14",
      "umur_15_19",
      "umur_20_24",
      "umur_25_29",
      "umur_30_34",
      "umur_35_39",
      "umur_40_44",
      "umur_45_49",
      "umur_50_plus",
    ];

    for (const field of ageFields) {
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
    const validation = this.validateAgeGroupData(data);
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
      throw new Error("Data umur statistik untuk tahun ini sudah ada");
    }

    return await this.create(data);
  }

  // Update with validation
  async updateWithValidation(id, data) {
    const validation = this.validateAgeGroupData(data);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // Check if record exists
    const exists = await this.exists(id);
    if (!exists) {
      throw new Error("Data umur statistik tidak ditemukan");
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
        throw new Error("Data umur statistik untuk tahun ini sudah ada");
      }
    }

    return await this.update(id, data);
  }
}

export default UmurStatistikModel;
