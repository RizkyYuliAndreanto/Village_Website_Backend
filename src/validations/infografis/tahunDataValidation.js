import Joi from "joi";

export const createTahunDataValidation = Joi.object({
  tahun: Joi.number().integer().min(1900).max(2100).required().messages({
    "number.base": "Tahun harus berupa angka",
    "number.integer": "Tahun harus berupa bilangan bulat",
    "number.min": "Tahun tidak boleh kurang dari 1900",
    "number.max": "Tahun tidak boleh lebih dari 2100",
    "any.required": "Tahun wajib diisi",
  }),
  keterangan: Joi.string().allow(null, "").max(500).messages({
    "string.base": "Keterangan harus berupa teks",
    "string.max": "Keterangan tidak boleh lebih dari 500 karakter",
  }),
});

export const updateTahunDataValidation = Joi.object({
  tahun: Joi.number().integer().min(1900).max(2100).messages({
    "number.base": "Tahun harus berupa angka",
    "number.integer": "Tahun harus berupa bilangan bulat",
    "number.min": "Tahun tidak boleh kurang dari 1900",
    "number.max": "Tahun tidak boleh lebih dari 2100",
  }),
  keterangan: Joi.string().allow(null, "").max(500).messages({
    "string.base": "Keterangan harus berupa teks",
    "string.max": "Keterangan tidak boleh lebih dari 500 karakter",
  }),
})
  .min(1)
  .messages({
    "object.min": "Setidaknya satu field harus diisi untuk update",
  });

export const paramIdTahunValidation = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "ID harus berupa angka",
    "number.integer": "ID harus berupa bilangan bulat",
    "number.positive": "ID harus berupa angka positif",
    "any.required": "ID wajib diisi",
  }),
});

export const paramTahunValueValidation = Joi.object({
  tahun: Joi.number().integer().min(1900).max(2100).required().messages({
    "number.base": "Tahun harus berupa angka",
    "number.integer": "Tahun harus berupa bilangan bulat",
    "number.min": "Tahun tidak boleh kurang dari 1900",
    "number.max": "Tahun tidak boleh lebih dari 2100",
    "any.required": "Tahun wajib diisi",
  }),
});
