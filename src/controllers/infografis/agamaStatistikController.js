import AgamaStatistikModel from "../../models/AgamaStatistikModel.js";
import { paramTahunValueValidation } from "../../validations/infografis/tahunDataValidation.js"; // Kita pakai ulang

class AgamaStatistikController {
  static model = new AgamaStatistikModel();

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
      const data = await AgamaStatistikController.model.getByYear(tahun);

      if (!data) {
        return res.status(4.04).json({
          success: false,
          message: `Data statistik agama untuk tahun ${tahun} tidak ditemukan`,
        });
      }

      res.status(200).json({
        success: true,
        message: `Data statistik agama tahun ${tahun} berhasil diambil`,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  }

  // (Nanti Anda bisa tambahkan method CRUD (create, update, delete) di sini)
}

export default AgamaStatistikController;