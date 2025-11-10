import { db } from "../../../../config/database.js";
import {
  createMasyarakatSchema,
  updateMasyarakatSchema,
} from "../../../validations/ppid/masyarakat/masyarakat.js";

class MasyarakatController {
  static async index(req, res, next) {
    try {
      const { page = 1, limit = 20, dusun_id, rt_id, q } = req.query;
      const p = Math.max(1, parseInt(page, 10) || 1);
      const l = Math.max(1, parseInt(limit, 10) || 20);
      const offset = (p - 1) * l;

      const qb = db("masyarakats").select("*").orderBy("id", "asc");

      if (dusun_id) qb.where("dusun_id", dusun_id);
      if (rt_id) qb.where("rt_id", rt_id);
      if (q) {
        qb.where(function () {
          this.where("nama_lengkap", "like", `%${q}%`).orWhere(
            "nik",
            "like",
            `%${q}%`
          );
        });
      }

      const [countResult] = await qb
        .clone()
        .clearSelect()
        .count({ total: "*" });
      const total = Number(countResult?.total || 0);

      const rows = await qb.limit(l).offset(offset);

      return res.json({
        success: true,
        data: rows,
        meta: { total, page: p, limit: l, pages: Math.ceil(total / l) || 0 },
      });
    } catch (err) {
      next(err);
    }
  }

  static async show(req, res, next) {
    try {
      const { id } = req.params;
      const row = await db("masyarakats").where({ id }).first();
      if (!row)
        return res
          .status(404)
          .json({ success: false, message: "Masyarakat not found" });
      return res.json({ success: true, data: row });
    } catch (err) {
      next(err);
    }
  }

  static async store(req, res, next) {
    try {
      const { error, value } = createMasyarakatSchema.validate(req.body);
      if (error)
        return res.status(400).json({ success: false, message: error.message });

      // jika rt_id diberikan, pastikan ada
      if (value.rt_id) {
        const rt = await db("rts").where({ id: value.rt_id }).first();
        if (!rt)
          return res
            .status(400)
            .json({ success: false, message: "RT not found" });
      }

      // jika dusun_id diberikan, pastikan ada
      if (value.dusun_id) {
        const dusun = await db("dusuns").where({ id: value.dusun_id }).first();
        if (!dusun)
          return res
            .status(400)
            .json({ success: false, message: "Dusun not found" });
      }

      // cek duplikat NIK (jika diberikan dan bukan empty)
      if (value.nik && String(value.nik).trim() !== "") {
        const existsNik = await db("masyarakats")
          .where({ nik: value.nik })
          .first();
        if (existsNik) {
          return res.status(409).json({
            success: false,
            message: "NIK already used by another person",
          });
        }
      }

      const insertData = {
        rt_id: value.rt_id || null,
        dusun_id: value.dusun_id || null,
        nik: value.nik || null,
        no_kk: value.no_kk || null,
        nama_lengkap: value.nama_lengkap,
        jenis_kelamin: value.jenis_kelamin || null,
        tanggal_lahir: value.tanggal_lahir || null,
        alamat: value.alamat || null,
        pendidikan_terakhir: value.pendidikan_terakhir || null,
        pekerjaan: value.pekerjaan || null,
        no_hp: value.no_hp || null,
        agama: value.agama || null,
        status_perkawinan: value.status_perkawinan || null,
        hubungan_keluarga: value.hubungan_keluarga || null,
        catatan: value.catatan || null,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      };

      const [id] = await db("masyarakats").insert(insertData);
      const newRow = await db("masyarakats").where({ id }).first();
      return res.status(201).json({ success: true, data: newRow });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = updateMasyarakatSchema.validate(req.body);
      if (error)
        return res.status(400).json({ success: false, message: error.message });

      const exists = await db("masyarakats").where({ id }).first();
      if (!exists)
        return res
          .status(404)
          .json({ success: false, message: "Masyarakat not found" });

      if (value.rt_id !== undefined && value.rt_id !== null) {
        const rt = await db("rts").where({ id: value.rt_id }).first();
        if (!rt)
          return res
            .status(400)
            .json({ success: false, message: "RT not found" });
      }

      if (value.dusun_id !== undefined && value.dusun_id !== null) {
        const dusun = await db("dusuns").where({ id: value.dusun_id }).first();
        if (!dusun)
          return res
            .status(400)
            .json({ success: false, message: "Dusun not found" });
      }

      // cek duplikat NIK saat update (jika diberikan dan bukan empty)
      if (
        value.nik !== undefined &&
        value.nik !== null &&
        String(value.nik).trim() !== ""
      ) {
        const dup = await db("masyarakats")
          .where({ nik: value.nik })
          .andWhereNot({ id })
          .first();
        if (dup) {
          return res.status(409).json({
            success: false,
            message: "NIK already used by another person",
          });
        }
      }

      const updateData = {
        ...(value.rt_id !== undefined ? { rt_id: value.rt_id || null } : {}),
        ...(value.dusun_id !== undefined
          ? { dusun_id: value.dusun_id || null }
          : {}),
        ...(value.nik !== undefined ? { nik: value.nik || null } : {}),
        ...(value.no_kk !== undefined ? { no_kk: value.no_kk || null } : {}),
        ...(value.nama_lengkap !== undefined
          ? { nama_lengkap: value.nama_lengkap }
          : {}),
        ...(value.jenis_kelamin !== undefined
          ? { jenis_kelamin: value.jenis_kelamin || null }
          : {}),
        ...(value.tanggal_lahir !== undefined
          ? { tanggal_lahir: value.tanggal_lahir || null }
          : {}),
        ...(value.alamat !== undefined ? { alamat: value.alamat || null } : {}),
        ...(value.pendidikan_terakhir !== undefined
          ? { pendidikan_terakhir: value.pendidikan_terakhir || null }
          : {}),
        ...(value.pekerjaan !== undefined
          ? { pekerjaan: value.pekerjaan || null }
          : {}),
        ...(value.no_hp !== undefined ? { no_hp: value.no_hp || null } : {}),
        ...(value.agama !== undefined ? { agama: value.agama || null } : {}),
        ...(value.status_perkawinan !== undefined
          ? { status_perkawinan: value.status_perkawinan || null }
          : {}),
        ...(value.hubungan_keluarga !== undefined
          ? { hubungan_keluarga: value.hubungan_keluarga || null }
          : {}),
        ...(value.catatan !== undefined
          ? { catatan: value.catatan || null }
          : {}),
        updated_at: db.fn.now(),
      };

      await db("masyarakats").where({ id }).update(updateData);
      const updated = await db("masyarakats").where({ id }).first();
      return res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async destroy(req, res, next) {
    try {
      const { id } = req.params;
      const exists = await db("masyarakats").where({ id }).first();
      if (!exists)
        return res
          .status(404)
          .json({ success: false, message: "Masyarakat not found" });

      await db("masyarakats").where({ id }).del();
      return res.json({ success: true, message: "Masyarakat deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export default MasyarakatController;
