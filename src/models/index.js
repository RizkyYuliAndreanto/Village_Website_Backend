// Export all models
export { default as BaseModel } from "./BaseModel.js";
export { default as BaseChildModel } from "./BaseChildModel.js";
export { default as TahunDataModel } from "./TahunDataModel.js";
export { default as DemografiPendudukModel } from "./DemografiPendudukModel.js";
export { default as UmurStatistikModel } from "./UmurStatistikModel.js";
export { default as AgamaStatistikModel } from "./AgamaStatistikModel.js";

// Named exports for easy access
export const Models = {
  BaseModel,
  BaseChildModel,
  TahunData: TahunDataModel,
  DemografiPenduduk: DemografiPendudukModel,
  UmurStatistik: UmurStatistikModel,
  AgamaStatistik: AgamaStatistikModel,
};
