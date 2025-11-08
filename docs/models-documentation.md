# Models Documentation - Village Website Backend

## Overview

Dokumentasi lengkap untuk semua model yang digunakan dalam sistem website desa. Sistem ini menggunakan pattern inheritance dengan `BaseChildModel` untuk semua tabel yang berelasi dengan `tahun_data`.

## Model Hierarchy

```
BaseModel (for standalone tables)
├── TahunDataModel (parent table)

BaseChildModel (for child tables)
├── DemografiPendudukModel
├── UmurStatistikModel
├── AgamaStatistikModel
└── (other future statistical models)
```

## Models Description

### 1. BaseModel

**File**: `src/models/BaseModel.js`
**Purpose**: Base class untuk tabel yang tidak memiliki relasi parent-child

**Features**:

- Basic CRUD operations
- Generic database operations
- Timestamp management
- Count dan exists methods

### 2. BaseChildModel

**File**: `src/models/BaseChildModel.js`
**Purpose**: Base class untuk semua tabel yang berelasi dengan `tahun_data`

**Features**:

- Semua fitur dari BaseModel
- Auto-join dengan tahun_data
- Year-based queries
- Year validation
- Relasi management

**Common Methods**:

```javascript
// Join operations
getAllWithYear(); // Get all with year info
getByIdWithYear(id); // Get by ID with year info
getByYear(tahun); // Get by specific year
getByTahunId(tahunId); // Get by tahun_id

// Validation
validateTahunId(tahunId); // Check if tahun_id exists
existsByTahunId(tahunId); // Check if data exists for year
existsByTahunIdExcluding(tahunId, excludeId); // For update validation

// Statistics
getBasicStats(); // Get basic statistics
getLatest(); // Get latest record by year
getByYearRange(start, end); // Get records in year range
```

### 3. TahunDataModel

**File**: `src/models/TahunDataModel.js`
**Table**: `tahun_data`
**Purpose**: Model untuk tabel parent yang menyimpan data tahun

**Specific Methods**:

```javascript
getByYear(year); // Get year record by year value
yearExists(year); // Check if year exists
getLatestYear(); // Get latest year
getPreviousYear(year); // Get previous year
getNextYear(year); // Get next year
getYearsInRange(start, end); // Get years in range
```

### 4. DemografiPendudukModel

**File**: `src/models/DemografiPendudukModel.js`
**Table**: `demografi_penduduk`
**Purpose**: Model untuk data demografi penduduk

**Fields**:

- `total_penduduk`: Total population
- `laki-laki`: Male population (note: hyphen in DB field)
- `perempuan`: Female population
- `penduduk_sementara`: Temporary residents
- `mutasi_penduduk`: Population migration

**Specific Methods**:

```javascript
getGenderDistributionByYear(tahun); // Gender distribution analysis
getPopulationGrowthByYears(y1, y2); // Population growth comparison
getPopulationMobilityByYear(tahun); // Mobility and migration info
getAllYearStats(); // Comprehensive yearly stats
getLatestTrends(); // Latest population trends
validateDemographicData(data); // Data validation
createWithValidation(data); // Create with validation
updateWithValidation(id, data); // Update with validation
```

**Field Mapping**:

```javascript
// API/Controller uses: laki_laki
// Database field: "laki-laki"
// Model handles the mapping automatically
```

### 5. UmurStatistikModel

**File**: `src/models/UmurStatistikModel.js`
**Table**: `umur_statistik`
**Purpose**: Model untuk statistik umur penduduk

**Age Groups**:

- `umur_0_4`: Age 0-4
- `umur_5_9`: Age 5-9
- `umur_10_14`: Age 10-14
- `umur_15_19`: Age 15-19
- `umur_20_24`: Age 20-24
- `umur_25_29`: Age 25-29
- `umur_30_34`: Age 30-34
- `umur_35_39`: Age 35-39
- `umur_40_44`: Age 40-44
- `umur_45_49`: Age 45-49
- `umur_50_plus`: Age 50+

**Specific Methods**:

```javascript
getAgeGroupsByYear(tahun); // Age groups for specific year
getTotalPopulationByYear(tahun); // Total from age groups
getAgeDistributionByYear(tahun); // Age distribution with percentages
compareAgeGroupsByYears(y1, y2); // Age comparison between years
getDominantAgeGroupsByYear(tahun); // Most/least populated age groups
getAllYearStats(); // Age statistics for all years
validateAgeGroupData(data); // Age data validation
createWithValidation(data); // Create with validation
updateWithValidation(id, data); // Update with validation
```

**Categories**:

```javascript
// Child (0-14): umur_0_4 + umur_5_9 + umur_10_14
// Working Age (15-49): umur_15_19 + ... + umur_45_49
// Elderly (50+): umur_50_plus
```

### 6. AgamaStatistikModel

**File**: `src/models/AgamaStatistikModel.js`
**Table**: `agama_statistik`
**Purpose**: Model untuk statistik agama penduduk

**Religion Fields**:

- `islam`: Islam
- `katolik`: Catholic
- `kristen`: Christian/Protestant
- `hindu`: Hindu
- `buddha`: Buddhist
- `konghucu`: Confucian
- `kepercayaan_lain`: Other beliefs

**Specific Methods**:

```javascript
getReligionsByYear(tahun); // Religion data for specific year
getTotalPopulationByYear(tahun); // Total from religion data
getReligionDistributionByYear(tahun); // Religion distribution with percentages
compareReligionsByYears(y1, y2); // Religion comparison between years
getDominantReligionsByYear(tahun); // Most practiced religions
getReligionDiversityByYear(tahun); // Diversity index calculation
getAllYearStats(); // Religion statistics for all years
getMinorityReligionsByYear(tahun); // Minority religions summary
validateReligionData(data); // Religion data validation
createWithValidation(data); // Create with validation
updateWithValidation(id, data); // Update with validation
```

**Diversity Analysis**:

```javascript
// Uses Simpson's Diversity Index
// 0 = No diversity (single religion)
// Closer to 1 = High diversity
```

## Usage Examples

### 1. Basic CRUD Operations

```javascript
import { DemografiPendudukModel } from "../models/index.js";

const demografiModel = new DemografiPendudukModel();

// Get all data with year information
const allData = await demografiModel.getAllWithYear();

// Get specific year data
const data2024 = await demografiModel.getByYear(2024);

// Create new record
const newData = await demografiModel.createWithValidation({
  tahun_id: 1,
  total_penduduk: 1500,
  laki_laki: 750, // Will be mapped to "laki-laki" in DB
  perempuan: 750,
  penduduk_sementara: 50,
  mutasi_penduduk: 25,
});
```

### 2. Statistical Analysis

```javascript
import { UmurStatistikModel, AgamaStatistikModel } from "../models/index.js";

const umurModel = new UmurStatistikModel();
const agamaModel = new AgamaStatistikModel();

// Age distribution analysis
const ageDistribution = await umurModel.getAgeDistributionByYear(2024);

// Religion diversity analysis
const religiousDiversity = await agamaModel.getReligionDiversityByYear(2024);

// Compare between years
const ageComparison = await umurModel.compareAgeGroupsByYears(2023, 2024);
```

### 3. Model Inheritance Usage

```javascript
// All child models inherit from BaseChildModel
const models = [
  new DemografiPendudukModel(),
  new UmurStatistikModel(),
  new AgamaStatistikModel(),
];

// Common operations available on all child models
for (const model of models) {
  const stats = await model.getBasicStats();
  const latest = await model.getLatest();
  const count = await model.count();
}
```

### 4. Validation Examples

```javascript
const demografiModel = new DemografiPendudukModel();

try {
  const data = await demografiModel.createWithValidation({
    tahun_id: 999, // Non-existent tahun_id
    total_penduduk: 1000,
    laki_laki: 600,
    perempuan: 500,
  });
} catch (error) {
  console.log(error.message); // "Tahun data tidak ditemukan"
}

try {
  const data = await demografiModel.createWithValidation({
    tahun_id: 1,
    total_penduduk: 1000,
    laki_laki: 600,
    perempuan: 500, // 600 + 500 > 1000
  });
} catch (error) {
  console.log(error.message); // "Jumlah laki-laki dan perempuan tidak boleh melebihi total penduduk"
}
```

## Database Field Mapping

### Important Notes:

1. **demografi_penduduk.laki-laki**: Field name in database contains hyphen, models handle the mapping
2. **Timestamps**: All models use `created_at` and `updated_at` (note: some migrations use `create_at`)
3. **Foreign Keys**: All child tables have `tahun_id` referencing `tahun_data.id_tahun`

## Migration Consistency Check

### Timestamp Fields:

- ✅ **tahun_data**: `created_at`, `updated_at`
- ❌ **demografi_penduduk**: `create_at`, `updated_at` (inconsistent)
- ✅ **umur_statistik**: `created_at`, `updated_at`
- ❌ **agama_statistik**: `create_at`, `updated_at` (inconsistent)

### Recommendation:

Create migration to standardize timestamp field names across all tables.

## Future Enhancements

1. **Add More Statistical Models**:

   - PendidikanStatistikModel
   - PekerjaanStatistikModel
   - PerkawinanStatistikModel

2. **Cross-Model Analytics**:

   - Population correlation analysis
   - Demographic trend predictions
   - Statistical reporting

3. **Caching Layer**:

   - Redis caching for frequently accessed statistics
   - Cache invalidation on data updates

4. **Data Export**:
   - CSV/Excel export functionality
   - Chart data formatting

## Testing

```javascript
// Example test structure
import { DemografiPendudukModel } from "../src/models/index.js";

describe("DemografiPendudukModel", () => {
  const model = new DemografiPendudukModel();

  test("should create demographic data", async () => {
    const data = await model.createWithValidation({
      tahun_id: 1,
      total_penduduk: 1000,
      laki_laki: 500,
      perempuan: 500,
    });
    expect(data.total_penduduk).toBe(1000);
  });

  test("should validate gender sum", async () => {
    await expect(
      model.createWithValidation({
        tahun_id: 1,
        total_penduduk: 1000,
        laki_laki: 600,
        perempuan: 500, // Sum exceeds total
      })
    ).rejects.toThrow();
  });
});
```
