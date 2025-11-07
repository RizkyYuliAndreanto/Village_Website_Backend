import { db } from "../../../config/database.js";
import { createRtSchema, updateRtSchema } from "../../validations/ppid/rt.js";

class RtController {
  static async index(req, res, next) {
    try {
      const rows = await db("rts").select("*").orderBy("id", "asc");
      return res.json({ success: true, data: rows });
    } catch (err) {
      next(err);
    }
  }

  static async show(req, res, next) {
    try {
      const { id } = req.params;
      const row = await db("rts").where({ id }).first();
      if (!row)
        return res
          .status(404)
          .json({ success: false, message: "RT not found" });
      return res.json({ success: true, data: row });
    } catch (err) {
      next(err);
    }
  }

  static async store(req, res, next) {
    try {
      const { error, value } = createRtSchema.validate(req.body);
      if (error)
        return res.status(400).json({ success: false, message: error.message });

      // pastikan dusun ada
      const dusun = await db("dusuns").where({ id: value.dusun_id }).first();
      if (!dusun)
        return res
          .status(400)
          .json({ success: false, message: "Dusun not found" });

      // cek duplikat kode (jika diberikan)
      if (value.kode && String(value.kode).trim() !== "") {
        const exists = await db("rts").where({ kode: value.kode }).first();
        if (exists) {
          return res
            .status(409)
            .json({ success: false, message: "Kode RT already used" });
        }
      }

      const [id] = await db("rts").insert({
        dusun_id: value.dusun_id,
        nama: value.nama,
        kode: value.kode || null,
        keterangan: value.keterangan || null,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      });

      const newRow = await db("rts").where({ id }).first();
      return res.status(201).json({ success: true, data: newRow });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = updateRtSchema.validate(req.body);
      if (error)
        return res.status(400).json({ success: false, message: error.message });

      const exists = await db("rts").where({ id }).first();
      if (!exists)
        return res
          .status(404)
          .json({ success: false, message: "RT not found" });

      if (value.dusun_id !== undefined) {
        const dusun = await db("dusuns").where({ id: value.dusun_id }).first();
        if (!dusun)
          return res
            .status(400)
            .json({ success: false, message: "Dusun not found" });
      }

      // jika kode diupdate dan tidak kosong -> pastikan tidak dipakai record lain
      if (
        value.kode !== undefined &&
        value.kode !== null &&
        String(value.kode).trim() !== ""
      ) {
        const dup = await db("rts")
          .where({ kode: value.kode })
          .andWhereNot({ id })
          .first();
        if (dup)
          return res
            .status(409)
            .json({ success: false, message: "Kode RT already used" });
      }

      await db("rts")
        .where({ id })
        .update({
          ...(value.dusun_id !== undefined ? { dusun_id: value.dusun_id } : {}),
          ...(value.nama !== undefined ? { nama: value.nama } : {}),
          ...(value.kode !== undefined ? { kode: value.kode || null } : {}),
          ...(value.keterangan !== undefined
            ? { keterangan: value.keterangan }
            : {}),
          updated_at: db.fn.now(),
        });

      const updated = await db("rts").where({ id }).first();
      return res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async destroy(req, res, next) {
    try {
      const { id } = req.params;
      const exists = await db("rts").where({ id }).first();
      if (!exists)
        return res
          .status(404)
          .json({ success: false, message: "RT not found" });

      await db("rts").where({ id }).del();
      return res.json({ success: true, message: "RT deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export default RtController;
