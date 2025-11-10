import UmurStatistikModel from "../../models/UmurStatistikModel.js";
import { paramTahunValueValidation } from "../../validations/infografis/tahunDataValidation.js";

class UmurStatistikController {
  static model = new UmurStatistikModel();

  // Get by year (untuk chart)
  static async getByYear(req, res, next) {
    try {
      const { error, value } = paramTahunValueValidation.validate(req.params);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const { tahun } = value;
      // Gunakan UmurStatistikModel untuk mengambil data
      const data = await UmurStatistikController.model.getByYear(tahun); 

      if (!data) {
        return res.status(404).json({
          success: false,
          message: `Data statistik umur untuk tahun ${tahun} tidak ditemukan`,
        });
      }

      res.status(200).json({
        success: true,
        message: `Data statistik umur tahun ${tahun} berhasil diambil`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UmurStatistikController;