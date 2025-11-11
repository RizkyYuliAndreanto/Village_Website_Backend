import Joi from "joi";

export const createAgamaStatistikValidation = Joi.object({
  tahun_id: Joi.number().integer().positive().required().messages({
    "number.base": "Tahun ID harus berupa angka",
    "number.integer": "Tahun ID harus berupa bilangan bulat",
    "number.positive": "Tahun ID harus berupa angka positif",
    "any.required": "Tahun ID wajib diisi"
  }),
  islam: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah Islam harus berupa angka",
    "number.integer": "Jumlah Islam harus berupa bilangan bulat",
    "number.min": "Jumlah Islam tidak boleh kurang dari 0"
  }),
  katolik: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah Katolik harus berupa angka",
    "number.integer": "Jumlah Katolik harus berupa bilangan bulat",
    "number.min": "Jumlah Katolik tidak boleh kurang dari 0"
  }),
  kristen: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah Kristen harus berupa angka",
    "number.integer": "Jumlah Kristen harus berupa bilangan bulat",
    "number.min": "Jumlah Kristen tidak boleh kurang dari 0"
  }),
  hindu: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah Hindu harus berupa angka",
    "number.integer": "Jumlah Hindu harus berupa bilangan bulat",
    "number.min": "Jumlah Hindu tidak boleh kurang dari 0"
  }),
  budha: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah Budha harus berupa angka",
    "number.integer": "Jumlah Budha harus berupa bilangan bulat",
    "number.min": "Jumlah Budha tidak boleh kurang dari 0"
  }),
  konghucu: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah Konghucu harus berupa angka",
    "number.integer": "Jumlah Konghucu harus berupa bilangan bulat",
    "number.min": "Jumlah Konghucu tidak boleh kurang dari 0"
  }),
  kepercayaan_lain: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah kepercayaan lain harus berupa angka",
    "number.integer": "Jumlah kepercayaan lain harus berupa bilangan bulat",
    "number.min": "Jumlah kepercayaan lain tidak boleh kurang dari 0"
  })
});

export const updateAgamaStatistikValidation = Joi.object({
  tahun_id: Joi.number().integer().positive().messages({
    "number.base": "Tahun ID harus berupa angka",
    "number.integer": "Tahun ID harus berupa bilangan bulat",
    "number.positive": "Tahun ID harus berupa angka positif"
  }),
  islam: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah Islam harus berupa angka",
    "number.integer": "Jumlah Islam harus berupa bilangan bulat",
    "number.min": "Jumlah Islam tidak boleh kurang dari 0"
  }),
  katolik: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah Katolik harus berupa angka",
    "number.integer": "Jumlah Katolik harus berupa bilangan bulat",
    "number.min": "Jumlah Katolik tidak boleh kurang dari 0"
  }),
  kristen: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah Kristen harus berupa angka",
    "number.integer": "Jumlah Kristen harus berupa bilangan bulat",
    "number.min": "Jumlah Kristen tidak boleh kurang dari 0"
  }),
  hindu: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah Hindu harus berupa angka",
    "number.integer": "Jumlah Hindu harus berupa bilangan bulat",
    "number.min": "Jumlah Hindu tidak boleh kurang dari 0"
  }),
  budha: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah Budha harus berupa angka",
    "number.integer": "Jumlah Budha harus berupa bilangan bulat",
    "number.min": "Jumlah Budha tidak boleh kurang dari 0"
  }),
  konghucu: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah Konghucu harus berupa angka",
    "number.integer": "Jumlah Konghucu harus berupa bilangan bulat",
    "number.min": "Jumlah Konghucu tidak boleh kurang dari 0"
  }),
  kepercayaan_lain: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah kepercayaan lain harus berupa angka",
    "number.integer": "Jumlah kepercayaan lain harus berupa bilangan bulat",
    "number.min": "Jumlah kepercayaan lain tidak boleh kurang dari 0"
  })
}).min(1).messages({
  "object.min": "Setidaknya satu field harus diisi untuk update"
});

export const paramIdValidation = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "ID harus berupa angka",
    "number.integer": "ID harus berupa bilangan bulat",
    "number.positive": "ID harus berupa angka positif",
    "any.required": "ID wajib diisi"
  })
});

export const paramTahunValidation = Joi.object({
  tahun: Joi.number().integer().min(1900).max(2100).required().messages({
    "number.base": "Tahun harus berupa angka",
    "number.integer": "Tahun harus berupa bilangan bulat",
    "number.min": "Tahun tidak boleh kurang dari 1900",
    "number.max": "Tahun tidak boleh lebih dari 2100",
    "any.required": "Tahun wajib diisi"
  })
});