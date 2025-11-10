import { db } from "../../../../config/database.js";
import {
  createUmkmSchema,
  updateUmkmSchema,
} from "../../../validations/ppid/umkm/umkm.js";

const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[\s\_]+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-")
    .replace(/^\-+|\-+$/g, "");

class UmkmController {
  static async index(req, res, next) {
    try {
      const { page = 1, limit = 20, q, kategori_id, kota } = req.query;
      const p = Math.max(1, parseInt(page, 10) || 1);
      const l = Math.max(1, parseInt(limit, 10) || 20);
      const offset = (p - 1) * l;

      const qb = db("umkms").select("*").orderBy("id", "asc");
      if (kategori_id) qb.where("kategori_id", kategori_id);
      if (kota) qb.where("kota", "like", `%${kota}%`);
      if (q)
        qb.where(function () {
          this.where("nama", "like", `%${q}%`).orWhere(
            "pemilik",
            "like",
            `%${q}%`
          );
        });

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
      const row = await db("umkms").where({ id }).first();
      if (!row)
        return res
          .status(404)
          .json({ success: false, message: "UMKM not found" });
      return res.json({ success: true, data: row });
    } catch (err) {
      next(err);
    }
  }

  static async store(req, res, next) {
    try {
      const { error, value } = createUmkmSchema.validate(req.body);
      if (error)
        return res.status(400).json({ success: false, message: error.message });

      // kategori exists
      const kategori = await db("kategori_umkm")
        .where({ id: value.kategori_id })
        .first();
      if (!kategori)
        return res
          .status(400)
          .json({ success: false, message: "Kategori tidak ditemukan" });

      // slug
      const slug =
        value.slug && String(value.slug).trim() !== ""
          ? slugify(value.slug)
          : slugify(value.nama);
      const dup = await db("umkms").where({ slug }).first();
      if (dup)
        return res
          .status(409)
          .json({ success: false, message: "Slug sudah digunakan" });

      const insertData = {
        kategori_id: value.kategori_id,
        nama: value.nama,
        slug,
        deskripsi: value.deskripsi || null,
        pemilik: value.pemilik || null,
        alamat: value.alamat || null,
        dusun: value.dusun || null,
        rt: value.rt || null,
        rw: value.rw || null,
        kecamatan: value.kecamatan || null,
        kota: value.kota || null,
        provinsi: value.provinsi || null,
        kode_pos: value.kode_pos || null,
        telepon: value.telepon || null,
        whatsapp: value.whatsapp || null,
        email: value.email || null,
        website: value.website || null,
        sosial_facebook: value.sosial_facebook || null,
        sosial_instagram: value.sosial_instagram || null,
        sosial_tiktok: value.sosial_tiktok || null,
        jenis_usaha: value.jenis_usaha || null,
        status_usaha: value.status_usaha || null,
        omset_per_bulan: value.omset_per_bulan || null,
        skala_usaha: value.skala_usaha || null,
        jumlah_karyawan: value.jumlah_karyawan || null,
        logo_url: value.logo_url || null,
        foto_galeri: value.foto_galeri
          ? JSON.stringify(value.foto_galeri)
          : null,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      };

      const [id] = await db("umkms").insert(insertData);
      const newRow = await db("umkms").where({ id }).first();
      return res.status(201).json({ success: true, data: newRow });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = updateUmkmSchema.validate(req.body);
      if (error)
        return res.status(400).json({ success: false, message: error.message });

      const exists = await db("umkms").where({ id }).first();
      if (!exists)
        return res
          .status(404)
          .json({ success: false, message: "UMKM not found" });

      if (value.kategori_id !== undefined) {
        const kategori = await db("kategori_umkm")
          .where({ id: value.kategori_id })
          .first();
        if (!kategori)
          return res
            .status(400)
            .json({ success: false, message: "Kategori tidak ditemukan" });
      }

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
        const dup = await db("umkms")
          .where({ slug })
          .andWhereNot({ id })
          .first();
        if (dup)
          return res
            .status(409)
            .json({ success: false, message: "Slug sudah digunakan" });
      }

      const updateData = {
        ...(value.kategori_id !== undefined
          ? { kategori_id: value.kategori_id }
          : {}),
        ...(value.nama !== undefined ? { nama: value.nama } : {}),
        ...(value.slug !== undefined
          ? { slug: slug || null }
          : slug !== undefined
          ? { slug }
          : {}),
        ...(value.deskripsi !== undefined
          ? { deskripsi: value.deskripsi || null }
          : {}),
        ...(value.pemilik !== undefined
          ? { pemilik: value.pemilik || null }
          : {}),
        ...(value.alamat !== undefined ? { alamat: value.alamat || null } : {}),
        ...(value.dusun !== undefined ? { dusun: value.dusun || null } : {}),
        ...(value.rt !== undefined ? { rt: value.rt || null } : {}),
        ...(value.rw !== undefined ? { rw: value.rw || null } : {}),
        ...(value.kecamatan !== undefined
          ? { kecamatan: value.kecamatan || null }
          : {}),
        ...(value.kota !== undefined ? { kota: value.kota || null } : {}),
        ...(value.provinsi !== undefined
          ? { provinsi: value.provinsi || null }
          : {}),
        ...(value.kode_pos !== undefined
          ? { kode_pos: value.kode_pos || null }
          : {}),
        ...(value.telepon !== undefined
          ? { telepon: value.telepon || null }
          : {}),
        ...(value.whatsapp !== undefined
          ? { whatsapp: value.whatsapp || null }
          : {}),
        ...(value.email !== undefined ? { email: value.email || null } : {}),
        ...(value.website !== undefined
          ? { website: value.website || null }
          : {}),
        ...(value.sosial_facebook !== undefined
          ? { sosial_facebook: value.sosial_facebook || null }
          : {}),
        ...(value.sosial_instagram !== undefined
          ? { sosial_instagram: value.sosial_instagram || null }
          : {}),
        ...(value.sosial_tiktok !== undefined
          ? { sosial_tiktok: value.sosial_tiktok || null }
          : {}),
        ...(value.jenis_usaha !== undefined
          ? { jenis_usaha: value.jenis_usaha || null }
          : {}),
        ...(value.status_usaha !== undefined
          ? { status_usaha: value.status_usaha || null }
          : {}),
        ...(value.omset_per_bulan !== undefined
          ? { omset_per_bulan: value.omset_per_bulan }
          : {}),
        ...(value.skala_usaha !== undefined
          ? { skala_usaha: value.skala_usaha || null }
          : {}),
        ...(value.jumlah_karyawan !== undefined
          ? { jumlah_karyawan: value.jumlah_karyawan || null }
          : {}),
        ...(value.logo_url !== undefined
          ? { logo_url: value.logo_url || null }
          : {}),
        ...(value.foto_galeri !== undefined
          ? {
              foto_galeri: value.foto_galeri
                ? JSON.stringify(value.foto_galeri)
                : null,
            }
          : {}),
        updated_at: db.fn.now(),
      };

      await db("umkms").where({ id }).update(updateData);
      const updated = await db("umkms").where({ id }).first();
      return res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async destroy(req, res, next) {
    try {
      const { id } = req.params;
      const exists = await db("umkms").where({ id }).first();
      if (!exists)
        return res
          .status(404)
          .json({ success: false, message: "UMKM not found" });

      await db("umkms").where({ id }).del();
      return res.json({ success: true, message: "UMKM deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export default UmkmController;
