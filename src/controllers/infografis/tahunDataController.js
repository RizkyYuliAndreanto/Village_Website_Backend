import { db } from "../../../config/database.js";
import dotenv from "dotenv";
dotenv.config();

class TahunDataController {
  // Get all tahun data
  static async getAllTahunData(req, res, next) {
    try {
      const tahunData = await db("tahun_data")
        .select("*")
        .orderBy("tahun", "desc");

      res.status(200).json({
        success: true,
        message: "Data tahun berhasil diambil",
        data: tahunData,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get tahun data by ID
  static async getTahunDataById(req, res, next) {
    try {
      const { id } = req.params;

      const tahunData = await db("tahun_data").where("id_tahun", id).first();

      if (!tahunData) {
        return res.status(404).json({
          success: false,
          message: "Data tahun tidak ditemukan",
        });
      }

      res.status(200).json({
        success: true,
        message: "Data tahun berhasil diambil",
        data: tahunData,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get tahun data by year value
  static async getTahunDataByYear(req, res, next) {
    try {
      const { tahun } = req.params;

      const tahunData = await db("tahun_data").where("tahun", tahun).first();

      if (!tahunData) {
        return res.status(404).json({
          success: false,
          message: `Data untuk tahun ${tahun} tidak ditemukan`,
        });
      }

      res.status(200).json({
        success: true,
        message: `Data tahun ${tahun} berhasil diambil`,
        data: tahunData,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new tahun data
  static async createTahunData(req, res, next) {
    try {
      const { tahun, keterangan } = req.body;

      // Check if year already exists
      const existingTahun = await db("tahun_data")
        .where("tahun", tahun)
        .first();

      if (existingTahun) {
        return res.status(400).json({
          success: false,
          message: "Data untuk tahun ini sudah ada",
        });
      }

      const [newTahunId] = await db("tahun_data")
        .insert({
          tahun,
          keterangan: keterangan || null,
          created_at: db.fn.now(),
          updated_at: db.fn.now(),
        })
        .returning("id_tahun");

      const newTahun = await db("tahun_data")
        .where("id_tahun", newTahunId)
        .first();

      res.status(201).json({
        success: true,
        message: "Data tahun berhasil dibuat",
        data: newTahun,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update tahun data
  static async updateTahunData(req, res, next) {
    try {
      const { id } = req.params;
      const { tahun, keterangan } = req.body;

      // Check if data exists
      const existingData = await db("tahun_data").where("id_tahun", id).first();

      if (!existingData) {
        return res.status(404).json({
          success: false,
          message: "Data tahun tidak ditemukan",
        });
      }

      // If tahun is being updated, check if new year already exists
      if (tahun && tahun !== existingData.tahun) {
        const duplicateYear = await db("tahun_data")
          .where("tahun", tahun)
          .where("id_tahun", "!=", id)
          .first();

        if (duplicateYear) {
          return res.status(400).json({
            success: false,
            message: "Data untuk tahun ini sudah ada",
          });
        }
      }

      const updateData = {
        updated_at: db.fn.now(),
      };

      if (tahun !== undefined) updateData.tahun = tahun;
      if (keterangan !== undefined) updateData.keterangan = keterangan;

      await db("tahun_data").where("id_tahun", id).update(updateData);

      const updatedTahun = await db("tahun_data").where("id_tahun", id).first();

      res.status(200).json({
        success: true,
        message: "Data tahun berhasil diperbarui",
        data: updatedTahun,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete tahun data
  static async deleteTahunData(req, res, next) {
    try {
      const { id } = req.params;

      const existingData = await db("tahun_data").where("id_tahun", id).first();

      if (!existingData) {
        return res.status(404).json({
          success: false,
          message: "Data tahun tidak ditemukan",
        });
      }

      // Check if tahun is referenced by other tables (demografi_penduduk, etc)
      const referencedInDemografi = await db("demografi_penduduk")
        .where("tahun_id", id)
        .count("* as total")
        .first();

      if (parseInt(referencedInDemografi.total) > 0) {
        return res.status(400).json({
          success: false,
          message:
            "Data tahun tidak dapat dihapus karena masih digunakan di data demografi penduduk",
        });
      }

      await db("tahun_data").where("id_tahun", id).del();

      res.status(200).json({
        success: true,
        message: "Data tahun berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }

  // Get years with statistics (how many data entries per year)
  static async getTahunDataWithStats(req, res, next) {
    try {
      const tahunWithStats = await db("tahun_data")
        .leftJoin(
          "demografi_penduduk",
          "tahun_data.id_tahun",
          "demografi_penduduk.tahun_id"
        )
        .select(
          "tahun_data.*",
          db.raw("COUNT(demografi_penduduk.id_demografi) as demografi_count")
        )
        .groupBy("tahun_data.id_tahun")
        .orderBy("tahun_data.tahun", "desc");

      res.status(200).json({
        success: true,
        message: "Data tahun dengan statistik berhasil diambil",
        data: tahunWithStats,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get available years range
  static async getYearsRange(req, res, next) {
    try {
      const minMax = await db("tahun_data")
        .select(
          db.raw("MIN(tahun) as min_year"),
          db.raw("MAX(tahun) as max_year"),
          db.raw("COUNT(*) as total_years")
        )
        .first();

      const yearsList = await db("tahun_data")
        .select("tahun")
        .orderBy("tahun", "asc")
        .pluck("tahun");

      res.status(200).json({
        success: true,
        message: "Range tahun berhasil diambil",
        data: {
          min_year: minMax.min_year,
          max_year: minMax.max_year,
          total_years: parseInt(minMax.total_years),
          available_years: yearsList,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default TahunDataController;
