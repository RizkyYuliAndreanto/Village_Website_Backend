import AgamaStatistikModel from "../../models/AgamaStatistikModel.js";
import dotenv from "dotenv";
dotenv.config();

class AgamaStatistikController {
  static model = new AgamaStatistikModel();

  // Get all agama statistik data
  static async getAllAgamaStatistik(req, res, next) {
    try {
      const agamaData = await AgamaStatistikController.model.getAllWithYear();

      res.status(200).json({
        success: true,
        message: "Data agama statistik berhasil diambil",
        data: agamaData,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get agama statistik by ID
  static async getAgamaStatistikById(req, res, next) {
    try {
      const { id } = req.params;
      const agamaData = await AgamaStatistikController.model.getByIdWithYear(id);

      if (!agamaData) {
        return res.status(404).json({
          success: false,
          message: "Data agama statistik tidak ditemukan",
        });
      }

      res.status(200).json({
        success: true,
        message: "Data agama statistik berhasil diambil",
        data: agamaData,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get agama statistik by year
  static async getAgamaStatistikByYear(req, res, next) {
    try {
      const { tahun } = req.params;
      const agamaData = await AgamaStatistikController.model.getByYear(tahun);

      if (!agamaData) {
        return res.status(404).json({
          success: false,
          message: `Data agama statistik untuk tahun ${tahun} tidak ditemukan`,
        });
      }

      res.status(200).json({
        success: true,
        message: `Data agama statistik tahun ${tahun} berhasil diambil`,
        data: agamaData,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new agama statistik
  static async createAgamaStatistik(req, res, next) {
    try {
      const {
        tahun_id,
        islam,
        katolik,
        kristen,
        hindu,
        budha,
        konghucu,
        kepercayaan_lain
      } = req.body;

      // Validate tahun_id exists
      const tahunExists = await AgamaStatistikController.model.validateTahunId(tahun_id);
      if (!tahunExists) {
        return res.status(400).json({
          success: false,
          message: "Tahun data tidak ditemukan",
        });
      }

      // Check if data for this year already exists
      const existingData = await AgamaStatistikController.model.existsByTahunId(tahun_id);
      if (existingData) {
        return res.status(400).json({
          success: false,
          message: "Data agama statistik untuk tahun ini sudah ada",
        });
      }

      const newAgama = await AgamaStatistikController.model.create({
        tahun_id,
        islam: islam || 0,
        katolik: katolik || 0,
        kristen: kristen || 0,
        hindu: hindu || 0,
        budha: budha || 0,
        konghucu: konghucu || 0,
        kepercayaan_lain: kepercayaan_lain || 0
      });

      res.status(201).json({
        success: true,
        message: "Data agama statistik berhasil dibuat",
        data: newAgama,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update agama statistik
  static async updateAgamaStatistik(req, res, next) {
    try {
      const { id } = req.params;
      const {
        tahun_id,
        islam,
        katolik,
        kristen,
        hindu,
        budha,
        konghucu,
        kepercayaan_lain
      } = req.body;

      // Check if data exists
      const existingData = await AgamaStatistikController.model.getById(id);
      if (!existingData) {
        return res.status(404).json({
          success: false,
          message: "Data agama statistik tidak ditemukan",
        });
      }

      // If tahun_id is being updated, validate it
      if (tahun_id && tahun_id !== existingData.tahun_id) {
        const tahunExists = await AgamaStatistikController.model.validateTahunId(tahun_id);
        if (!tahunExists) {
          return res.status(400).json({
            success: false,
            message: "Tahun data tidak ditemukan",
          });
        }

        const duplicateData = await AgamaStatistikController.model.existsByTahunIdExcluding(tahun_id, id);
        if (duplicateData) {
          return res.status(400).json({
            success: false,
            message: "Data agama statistik untuk tahun ini sudah ada",
          });
        }
      }

      const updateData = {};
      if (tahun_id !== undefined) updateData.tahun_id = tahun_id;
      if (islam !== undefined) updateData.islam = islam;
      if (katolik !== undefined) updateData.katolik = katolik;
      if (kristen !== undefined) updateData.kristen = kristen;
      if (hindu !== undefined) updateData.hindu = hindu;
      if (budha !== undefined) updateData.budha = budha;
      if (konghucu !== undefined) updateData.konghucu = konghucu;
      if (kepercayaan_lain !== undefined) updateData.kepercayaan_lain = kepercayaan_lain;

      const updatedAgama = await AgamaStatistikController.model.update(id, updateData);

      res.status(200).json({
        success: true,
        message: "Data agama statistik berhasil diperbarui",
        data: updatedAgama,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete agama statistik
  static async deleteAgamaStatistik(req, res, next) {
    try {
      const { id } = req.params;

      const existingData = await AgamaStatistikController.model.exists(id);
      if (!existingData) {
        return res.status(404).json({
          success: false,
          message: "Data agama statistik tidak ditemukan",
        });
      }

      await AgamaStatistikController.model.delete(id);

      res.status(200).json({
        success: true,
        message: "Data agama statistik berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }

  // Get statistics/summary
  static async getAgamaStatistikStats(req, res, next) {
    try {
      const stats = await AgamaStatistikController.model.getAllYearStats();

      if (!stats || stats.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Tidak ada data agama statistik",
        });
      }

      res.status(200).json({
        success: true,
        message: "Statistik agama berhasil diambil",
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

export default AgamaStatistikController;