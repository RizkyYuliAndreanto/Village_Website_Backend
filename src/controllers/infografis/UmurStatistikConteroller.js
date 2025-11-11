import UmurStatistikModel from "../../models/UmurStatistikModel.js";
import dotenv from "dotenv";
dotenv.config();

class UmurStatistikController {
  static model = new UmurStatistikModel();

  // Get all umur statistik data
  static async getAllUmurStatistik(req, res, next) {
    try {
      const umurData = await UmurStatistikController.model.getAllWithYear();

      res.status(200).json({
        success: true,
        message: "Data umur statistik berhasil diambil",
        data: umurData,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get umur statistik by ID
  static async getUmurStatistikById(req, res, next) {
    try {
      const { id } = req.params;
      const umurData = await UmurStatistikController.model.getByIdWithYear(id);

      if (!umurData) {
        return res.status(404).json({
          success: false,
          message: "Data umur statistik tidak ditemukan",
        });
      }

      res.status(200).json({
        success: true,
        message: "Data umur statistik berhasil diambil",
        data: umurData,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get umur statistik by year
  static async getUmurStatistikByYear(req, res, next) {
    try {
      const { tahun } = req.params;
      const umurData = await UmurStatistikController.model.getByYear(tahun);

      if (!umurData) {
        return res.status(404).json({
          success: false,
          message: `Data umur statistik untuk tahun ${tahun} tidak ditemukan`,
        });
      }

      res.status(200).json({
        success: true,
        message: `Data umur statistik tahun ${tahun} berhasil diambil`,
        data: umurData,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get age group statistics for specific year
  static async getAgeGroupsByYear(req, res, next) {
    try {
      const { tahun } = req.params;
      const ageGroups = await UmurStatistikController.model.getAgeGroupsByYear(tahun);

      if (!ageGroups) {
        return res.status(404).json({
          success: false,
          message: `Data kelompok umur untuk tahun ${tahun} tidak ditemukan`,
        });
      }

      res.status(200).json({
        success: true,
        message: `Data kelompok umur tahun ${tahun} berhasil diambil`,
        data: ageGroups,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get age distribution (percentage) for specific year
  static async getAgeDistributionByYear(req, res, next) {
    try {
      const { tahun } = req.params;
      const distribution = await UmurStatistikController.model.getAgeDistributionByYear(tahun);

      if (!distribution) {
        return res.status(404).json({
          success: false,
          message: `Data distribusi umur untuk tahun ${tahun} tidak ditemukan`,
        });
      }

      res.status(200).json({
        success: true,
        message: `Data distribusi umur tahun ${tahun} berhasil diambil`,
        data: distribution,
      });
    } catch (error) {
      next(error);
    }
  }

  // Compare age groups between two years
  static async compareAgeGroupsByYears(req, res, next) {
    try {
      const { tahun1, tahun2 } = req.params;
      const comparison = await UmurStatistikController.model.compareAgeGroupsByYears(tahun1, tahun2);

      if (!comparison) {
        return res.status(404).json({
          success: false,
          message: `Data perbandingan tidak dapat dibuat untuk tahun ${tahun1} dan ${tahun2}`,
        });
      }

      res.status(200).json({
        success: true,
        message: `Perbandingan data umur tahun ${tahun1} dan ${tahun2} berhasil diambil`,
        data: comparison,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new umur statistik
  static async createUmurStatistik(req, res, next) {
    try {
      const {
        tahun_id,
        umur_0_4,
        umur_5_9,
        umur_10_14,
        umur_15_19,
        umur_20_24,
        umur_25_29,
        umur_30_34,
        umur_35_39,
        umur_40_44,
        umur_45_49,
        umur_50_plus
      } = req.body;

      // Validate tahun_id exists
      const tahunExists = await UmurStatistikController.model.validateTahunId(tahun_id);
      if (!tahunExists) {
        return res.status(400).json({
          success: false,
          message: "Tahun data tidak ditemukan",
        });
      }

      // Check if data for this year already exists
      const existingData = await UmurStatistikController.model.existsByTahunId(tahun_id);
      if (existingData) {
        return res.status(400).json({
          success: false,
          message: "Data umur statistik untuk tahun ini sudah ada",
        });
      }

      const newUmur = await UmurStatistikController.model.create({
        tahun_id,
        umur_0_4: umur_0_4 || 0,
        umur_5_9: umur_5_9 || 0,
        umur_10_14: umur_10_14 || 0,
        umur_15_19: umur_15_19 || 0,
        umur_20_24: umur_20_24 || 0,
        umur_25_29: umur_25_29 || 0,
        umur_30_34: umur_30_34 || 0,
        umur_35_39: umur_35_39 || 0,
        umur_40_44: umur_40_44 || 0,
        umur_45_49: umur_45_49 || 0,
        umur_50_plus: umur_50_plus || 0
      });

      res.status(201).json({
        success: true,
        message: "Data umur statistik berhasil dibuat",
        data: newUmur,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update umur statistik
  static async updateUmurStatistik(req, res, next) {
    try {
      const { id } = req.params;
      const {
        tahun_id,
        umur_0_4,
        umur_5_9,
        umur_10_14,
        umur_15_19,
        umur_20_24,
        umur_25_29,
        umur_30_34,
        umur_35_39,
        umur_40_44,
        umur_45_49,
        umur_50_plus
      } = req.body;

      // Check if data exists
      const existingData = await UmurStatistikController.model.getById(id);
      if (!existingData) {
        return res.status(404).json({
          success: false,
          message: "Data umur statistik tidak ditemukan",
        });
      }

      // If tahun_id is being updated, validate it
      if (tahun_id && tahun_id !== existingData.tahun_id) {
        const tahunExists = await UmurStatistikController.model.validateTahunId(tahun_id);
        if (!tahunExists) {
          return res.status(400).json({
            success: false,
            message: "Tahun data tidak ditemukan",
          });
        }

        const duplicateData = await UmurStatistikController.model.existsByTahunIdExcluding(tahun_id, id);
        if (duplicateData) {
          return res.status(400).json({
            success: false,
            message: "Data umur statistik untuk tahun ini sudah ada",
          });
        }
      }

      const updateData = {};
      if (tahun_id !== undefined) updateData.tahun_id = tahun_id;
      if (umur_0_4 !== undefined) updateData.umur_0_4 = umur_0_4;
      if (umur_5_9 !== undefined) updateData.umur_5_9 = umur_5_9;
      if (umur_10_14 !== undefined) updateData.umur_10_14 = umur_10_14;
      if (umur_15_19 !== undefined) updateData.umur_15_19 = umur_15_19;
      if (umur_20_24 !== undefined) updateData.umur_20_24 = umur_20_24;
      if (umur_25_29 !== undefined) updateData.umur_25_29 = umur_25_29;
      if (umur_30_34 !== undefined) updateData.umur_30_34 = umur_30_34;
      if (umur_35_39 !== undefined) updateData.umur_35_39 = umur_35_39;
      if (umur_40_44 !== undefined) updateData.umur_40_44 = umur_40_44;
      if (umur_45_49 !== undefined) updateData.umur_45_49 = umur_45_49;
      if (umur_50_plus !== undefined) updateData.umur_50_plus = umur_50_plus;

      const updatedUmur = await UmurStatistikController.model.update(id, updateData);

      res.status(200).json({
        success: true,
        message: "Data umur statistik berhasil diperbarui",
        data: updatedUmur,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete umur statistik
  static async deleteUmurStatistik(req, res, next) {
    try {
      const { id } = req.params;

      const existingData = await UmurStatistikController.model.exists(id);
      if (!existingData) {
        return res.status(404).json({
          success: false,
          message: "Data umur statistik tidak ditemukan",
        });
      }

      await UmurStatistikController.model.delete(id);

      res.status(200).json({
        success: true,
        message: "Data umur statistik berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }

  // Get statistics/summary
  static async getUmurStatistikStats(req, res, next) {
    try {
      const stats = await UmurStatistikController.model.getAllYearStats();

      if (!stats || stats.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Tidak ada data umur statistik",
        });
      }

      res.status(200).json({
        success: true,
        message: "Statistik umur berhasil diambil",
        data: {
          yearly_stats: stats,
          summary: {
            total_years: stats.length,
            latest_year: stats[0]?.tahun,
            earliest_year: stats[stats.length - 1]?.tahun,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UmurStatistikController;