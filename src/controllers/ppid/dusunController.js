import { db } from "../../../config/database.js";
import {
  createDusunSchema,
  updateDusunSchema,
} from "../../validations/ppid/dusun.js";

class DusunController {
  static async index(req, res, next) {
    try {
      const rows = await db("dusuns").select("*").orderBy("id", "asc");
      return res.json({ success: true, data: rows });
    } catch (err) {
      next(err);
    }
  }

  static async show(req, res, next) {
    try {
      const { id } = req.params;
      const row = await db("dusuns").where({ id }).first();
      if (!row)
        return res
          .status(404)
          .json({ success: false, message: "Dusun not found" });
      return res.json({ success: true, data: row });
    } catch (err) {
      next(err);
    }
  }

  static async store(req, res, next) {
    try {
      const { error, value } = createDusunSchema.validate(req.body);
      if (error)
        return res.status(400).json({ success: false, message: error.message });

      // cek duplikat kode jika diberikan (null/empty diabaikan)
      if (value.kode && String(value.kode).trim() !== "") {
        const exists = await db("dusuns").where({ kode: value.kode }).first();
        if (exists) {
          return res.status(409).json({
            success: false,
            message: "Kode already used by another dusun",
          });
        }
      }

      const [id] = await db("dusuns").insert({
        nama: value.nama,
        kode: value.kode || null,
        keterangan: value.keterangan || null,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      });

      const newRow = await db("dusuns").where({ id }).first();
      const performedBy = req.user
        ? { id: req.user.id, name: req.user.name }
        : null;
      return res.status(201).json({ success: true, data: newRow, performedBy });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = updateDusunSchema.validate(req.body);
      if (error)
        return res.status(400).json({ success: false, message: error.message });

      const exists = await db("dusuns").where({ id }).first();
      if (!exists)
        return res
          .status(404)
          .json({ success: false, message: "Dusun not found" });

      // jika kode diupdate dan bukan kosong -> pastikan tidak dipakai oleh record lain
      if (
        value.kode !== undefined &&
        value.kode !== null &&
        String(value.kode).trim() !== ""
      ) {
        const dup = await db("dusuns")
          .where({ kode: value.kode })
          .andWhereNot({ id })
          .first();
        if (dup)
          return res
            .status(409)
            .json({
              success: false,
              message: "Kode already used by another dusun",
            });
      }

      await db("dusuns")
        .where({ id })
        .update({
          ...(value.nama !== undefined ? { nama: value.nama } : {}),
          ...(value.kode !== undefined ? { kode: value.kode || null } : {}),
          ...(value.keterangan !== undefined
            ? { keterangan: value.keterangan }
            : {}),
          updated_at: db.fn.now(),
        });

      const updated = await db("dusuns").where({ id }).first();
      const performedBy = req.user
        ? { id: req.user.id, name: req.user.name }
        : null;
      return res.json({ success: true, data: updated, performedBy });
    } catch (err) {
      next(err);
    }
  }

  static async destroy(req, res, next) {
    try {
      const { id } = req.params;
      const exists = await db("dusuns").where({ id }).first();
      if (!exists)
        return res
          .status(404)
          .json({ success: false, message: "Dusun not found" });

      await db("dusuns").where({ id }).del();
      const performedBy = req.user
        ? { id: req.user.id, name: req.user.name }
        : null;
      return res.json({ success: true, message: "Dusun deleted", performedBy });
    } catch (err) {
      next(err);
    }
  }
}

export default DusunController;
