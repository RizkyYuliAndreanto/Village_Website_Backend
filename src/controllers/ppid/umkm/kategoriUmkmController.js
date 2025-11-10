import { db } from "../../../../config/database.js";
import {
  createKategoriUmkmSchema,
  updateKategoriUmkmSchema,
} from "../../../validations/ppid/umkm/kategoriUmkm.js";

const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[\s\_]+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-")
    .replace(/^\-+|\-+$/g, "");

class KategoriUmkmController {
  static async index(req, res, next) {
    try {
      const { page = 1, limit = 20, q } = req.query;
      const p = Math.max(1, parseInt(page, 10) || 1);
      const l = Math.max(1, parseInt(limit, 10) || 20);
      const offset = (p - 1) * l;

      const qb = db("kategori_umkm").select("*").orderBy("id", "asc");
      if (q) qb.where("nama", "like", `%${q}%`);

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
      const row = await db("kategori_umkm").where({ id }).first();
      if (!row)
        return res
          .status(404)
          .json({ success: false, message: "Kategori UMKM not found" });
      return res.json({ success: true, data: row });
    } catch (err) {
      next(err);
    }
  }

  static async store(req, res, next) {
    try {
      const { error, value } = createKategoriUmkmSchema.validate(req.body);
      if (error)
        return res.status(400).json({ success: false, message: error.message });

      // generate slug if not provided
      const slug =
        value.slug && String(value.slug).trim() !== ""
          ? slugify(value.slug)
          : slugify(value.nama);

      // cek nama unik
      const existsNama = await db("kategori_umkm")
        .where({ nama: value.nama })
        .first();
      if (existsNama)
        return res
          .status(409)
          .json({ success: false, message: "Nama kategori sudah ada" });

      // cek slug unik
      const existsSlug = await db("kategori_umkm").where({ slug }).first();
      if (existsSlug)
        return res
          .status(409)
          .json({ success: false, message: "Slug sudah digunakan" });

      // cek parent exists jika diberikan
      if (value.parent_id) {
        const parent = await db("kategori_umkm")
          .where({ id: value.parent_id })
          .first();
        if (!parent)
          return res
            .status(400)
            .json({
              success: false,
              message: "Parent kategori tidak ditemukan",
            });
      }

      const [id] = await db("kategori_umkm").insert({
        nama: value.nama,
        slug,
        deskripsi: value.deskripsi || null,
        parent_id: value.parent_id || null,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      });

      const newRow = await db("kategori_umkm").where({ id }).first();
      return res.status(201).json({ success: true, data: newRow });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = updateKategoriUmkmSchema.validate(req.body);
      if (error)
        return res.status(400).json({ success: false, message: error.message });

      const exists = await db("kategori_umkm").where({ id }).first();
      if (!exists)
        return res
          .status(404)
          .json({ success: false, message: "Kategori UMKM not found" });

      // cek nama duplikat
      if (value.nama !== undefined) {
        const dupNama = await db("kategori_umkm")
          .where({ nama: value.nama })
          .andWhereNot({ id })
          .first();
        if (dupNama)
          return res
            .status(409)
            .json({ success: false, message: "Nama kategori sudah digunakan" });
      }

      // handle slug
      let slug;
      if (value.slug !== undefined) {
        slug =
          value.slug && String(value.slug).trim() !== ""
            ? slugify(value.slug)
            : null;
      } else if (value.nama !== undefined) {
        slug = slugify(value.nama);
      }

      if (slug) {
        const dupSlug = await db("kategori_umkm")
          .where({ slug })
          .andWhereNot({ id })
          .first();
        if (dupSlug)
          return res
            .status(409)
            .json({ success: false, message: "Slug sudah digunakan" });
      }

      if (value.parent_id !== undefined && value.parent_id !== null) {
        const parent = await db("kategori_umkm")
          .where({ id: value.parent_id })
          .first();
        if (!parent)
          return res
            .status(400)
            .json({
              success: false,
              message: "Parent kategori tidak ditemukan",
            });
        if (Number(value.parent_id) === Number(id))
          return res
            .status(400)
            .json({
              success: false,
              message: "Parent tidak boleh sama dengan self",
            });
      }

      await db("kategori_umkm")
        .where({ id })
        .update({
          ...(value.nama !== undefined ? { nama: value.nama } : {}),
          ...(value.slug !== undefined
            ? { slug: slug || null }
            : slug !== undefined
            ? { slug }
            : {}),
          ...(value.deskripsi !== undefined
            ? { deskripsi: value.deskripsi || null }
            : {}),
          ...(value.parent_id !== undefined
            ? { parent_id: value.parent_id || null }
            : {}),
          updated_at: db.fn.now(),
        });

      const updated = await db("kategori_umkm").where({ id }).first();
      return res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async destroy(req, res, next) {
    try {
      const { id } = req.params;
      const exists = await db("kategori_umkm").where({ id }).first();
      if (!exists)
        return res
          .status(404)
          .json({ success: false, message: "Kategori UMKM not found" });

      await db("kategori_umkm").where({ id }).del();
      return res.json({ success: true, message: "Kategori deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export default KategoriUmkmController;
