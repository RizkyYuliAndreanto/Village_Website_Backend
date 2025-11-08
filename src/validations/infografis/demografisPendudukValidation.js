import Joi from "joi";

export const createDemografiPendudukValidation = Joi.object({
  tahun_id: Joi.number().integer().positive().required().messages({
    "number.base": "Tahun ID harus berupa angka",
    "number.integer": "Tahun ID harus berupa bilangan bulat",
    "number.positive": "Tahun ID harus berupa angka positif",
    "any.required": "Tahun ID wajib diisi",
  }),
  total_penduduk: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Total penduduk harus berupa angka",
    "number.integer": "Total penduduk harus berupa bilangan bulat",
    "number.min": "Total penduduk tidak boleh kurang dari 0",
  }),
  laki_laki: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah laki-laki harus berupa angka",
    "number.integer": "Jumlah laki-laki harus berupa bilangan bulat",
    "number.min": "Jumlah laki-laki tidak boleh kurang dari 0",
  }),
  perempuan: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah perempuan harus berupa angka",
    "number.integer": "Jumlah perempuan harus berupa bilangan bulat",
    "number.min": "Jumlah perempuan tidak boleh kurang dari 0",
  }),
  penduduk_sementara: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Penduduk sementara harus berupa angka",
    "number.integer": "Penduduk sementara harus berupa bilangan bulat",
    "number.min": "Penduduk sementara tidak boleh kurang dari 0",
  }),
  mutasi_penduduk: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Mutasi penduduk harus berupa angka",
    "number.integer": "Mutasi penduduk harus berupa bilangan bulat",
    "number.min": "Mutasi penduduk tidak boleh kurang dari 0",
  }),
});

export const updateDemografiPendudukValidation = Joi.object({
  tahun_id: Joi.number().integer().positive().messages({
    "number.base": "Tahun ID harus berupa angka",
    "number.integer": "Tahun ID harus berupa bilangan bulat",
    "number.positive": "Tahun ID harus berupa angka positif",
  }),
  total_penduduk: Joi.number().integer().min(0).messages({
    "number.base": "Total penduduk harus berupa angka",
    "number.integer": "Total penduduk harus berupa bilangan bulat",
    "number.min": "Total penduduk tidak boleh kurang dari 0",
  }),
  laki_laki: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah laki-laki harus berupa angka",
    "number.integer": "Jumlah laki-laki harus berupa bilangan bulat",
    "number.min": "Jumlah laki-laki tidak boleh kurang dari 0",
  }),
  perempuan: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah perempuan harus berupa angka",
    "number.integer": "Jumlah perempuan harus berupa bilangan bulat",
    "number.min": "Jumlah perempuan tidak boleh kurang dari 0",
  }),
  penduduk_sementara: Joi.number().integer().min(0).messages({
    "number.base": "Penduduk sementara harus berupa angka",
    "number.integer": "Penduduk sementara harus berupa bilangan bulat",
    "number.min": "Penduduk sementara tidak boleh kurang dari 0",
  }),
  mutasi_penduduk: Joi.number().integer().min(0).messages({
    "number.base": "Mutasi penduduk harus berupa angka",
    "number.integer": "Mutasi penduduk harus berupa bilangan bulat",
    "number.min": "Mutasi penduduk tidak boleh kurang dari 0",
  }),
})
  .min(1)
  .messages({
    "object.min": "Setidaknya satu field harus diisi untuk update",
  });

export const paramIdValidation = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "ID harus berupa angka",
    "number.integer": "ID harus berupa bilangan bulat",
    "number.positive": "ID harus berupa angka positif",
    "any.required": "ID wajib diisi",
  }),
});

export const paramTahunValidation = Joi.object({
  tahun: Joi.number().integer().min(1900).max(2100).required().messages({
    "number.base": "Tahun harus berupa angka",
    "number.integer": "Tahun harus berupa bilangan bulat",
    "number.min": "Tahun tidak boleh kurang dari 1900",
    "number.max": "Tahun tidak boleh lebih dari 2100",
    "any.required": "Tahun wajib diisi",
  }),
});
