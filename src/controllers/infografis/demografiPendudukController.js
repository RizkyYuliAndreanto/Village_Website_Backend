import DemografiPendudukModel from "../../models/DemografiPendudukModel.js";
import dotenv from "dotenv";
dotenv.config();

class DemografiPendudukController {
  static model = new DemografiPendudukModel();
  // Get all demografi penduduk data
  static async getAllDemografiPenduduk(req, res, next) {
    try {
      const demografiData =
        await DemografiPendudukController.model.getAllWithYear();

      res.status(200).json({
        success: true,
        message: "Data demografi penduduk berhasil diambil",
        data: demografiData,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get demografi penduduk by ID
  static async getDemografiPendudukById(req, res, next) {
    try {
      const { id } = req.params;

      const demografiData =
        await DemografiPendudukController.model.getByIdWithYear(id);

      if (!demografiData) {
        return res.status(404).json({
          success: false,
          message: "Data demografi penduduk tidak ditemukan",
        });
      }

      res.status(200).json({
        success: true,
        message: "Data demografi penduduk berhasil diambil",
        data: demografiData,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get demografi penduduk by year
  static async getDemografiPendudukByYear(req, res, next) {
    try {
      const { tahun } = req.params;

      const demografiData = await DemografiPendudukController.model.getByYear(
        tahun
      );

      if (!demografiData) {
        return res.status(404).json({
          success: false,
          message: `Data demografi penduduk untuk tahun ${tahun} tidak ditemukan`,
        });
      }

      res.status(200).json({
        success: true,
        message: `Data demografi penduduk tahun ${tahun} berhasil diambil`,
        data: demografiData,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new demografi penduduk
  static async createDemografiPenduduk(req, res, next) {
    try {
      const {
        tahun_id,
        total_penduduk,
        laki_laki,
        perempuan,
        penduduk_sementara,
        mutasi_penduduk,
      } = req.body;

      // Validate tahun_id exists
      const tahunExists =
        await DemografiPendudukController.model.validateTahunId(tahun_id);
      if (!tahunExists) {
        return res.status(400).json({
          success: false,
          message: "Tahun data tidak ditemukan",
        });
      }

      // Check if data for this year already exists
      const existingData =
        await DemografiPendudukController.model.existsByTahunId(tahun_id);
      if (existingData) {
        return res.status(400).json({
          success: false,
          message: "Data demografi untuk tahun ini sudah ada",
        });
      }

      const newDemografi = await DemografiPendudukController.model.create({
        tahun_id,
        total_penduduk: total_penduduk || 0,
        "laki-laki": laki_laki || 0,
        perempuan: perempuan || 0,
        penduduk_sementara: penduduk_sementara || 0,
        mutasi_penduduk: mutasi_penduduk || 0,
      });

      res.status(201).json({
        success: true,
        message: "Data demografi penduduk berhasil dibuat",
        data: newDemografi,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update demografi penduduk
  static async updateDemografiPenduduk(req, res, next) {
    try {
      const { id } = req.params;
      const {
        tahun_id,
        total_penduduk,
        laki_laki,
        perempuan,
        penduduk_sementara,
        mutasi_penduduk,
      } = req.body;

      // Check if data exists
      const existingData = await DemografiPendudukController.model.getById(id);

      if (!existingData) {
        return res.status(404).json({
          success: false,
          message: "Data demografi penduduk tidak ditemukan",
        });
      }

      // If tahun_id is being updated, validate it
      if (tahun_id && tahun_id !== existingData.tahun_id) {
        const tahunExists =
          await DemografiPendudukController.model.validateTahunId(tahun_id);

        if (!tahunExists) {
          return res.status(400).json({
            success: false,
            message: "Tahun data tidak ditemukan",
          });
        }

        const duplicateData =
          await DemografiPendudukController.model.existsByTahunIdExcluding(
            tahun_id,
            id
          );

        if (duplicateData) {
          return res.status(400).json({
            success: false,
            message: "Data demografi untuk tahun ini sudah ada",
          });
        }
      }

      const updateData = {};

      if (tahun_id !== undefined) updateData.tahun_id = tahun_id;
      if (total_penduduk !== undefined)
        updateData.total_penduduk = total_penduduk;
      if (laki_laki !== undefined) updateData["laki-laki"] = laki_laki;
      if (perempuan !== undefined) updateData.perempuan = perempuan;
      if (penduduk_sementara !== undefined)
        updateData.penduduk_sementara = penduduk_sementara;
      if (mutasi_penduduk !== undefined)
        updateData.mutasi_penduduk = mutasi_penduduk;

      const updatedDemografi = await DemografiPendudukController.model.update(
        id,
        updateData
      );

      res.status(200).json({
        success: true,
        message: "Data demografi penduduk berhasil diperbarui",
        data: updatedDemografi,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete demografi penduduk
  static async deleteDemografiPenduduk(req, res, next) {
    try {
      const { id } = req.params;

      const existingData = await DemografiPendudukController.model.exists(id);

      if (!existingData) {
        return res.status(404).json({
          success: false,
          message: "Data demografi penduduk tidak ditemukan",
        });
      }

      await DemografiPendudukController.model.delete(id);

      res.status(200).json({
        success: true,
        message: "Data demografi penduduk berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }

  // Get statistics/summary
  static async getDemografiPendudukStats(req, res, next) {
    try {
      const stats = await DemografiPendudukController.model.getAllYearStats();

      if (!stats || stats.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Tidak ada data demografi penduduk",
        });
      }

      res.status(200).json({
        success: true,
        message: "Statistik demografi penduduk berhasil diambil",
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

  // Legacy method for backward compatibility
  static async getDemografiPenduduk(req, res, next) {
    return DemografiPendudukController.getAllDemografiPenduduk(req, res, next);
  }
}

export default DemografiPendudukController;
