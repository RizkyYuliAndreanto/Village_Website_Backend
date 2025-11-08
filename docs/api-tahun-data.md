# API Documentation - Tahun Data

## Overview

API untuk mengelola data tahun yang menjadi parent/referensi untuk semua data infografis desa.

## Base URL

```
/api/infografis/tahun-data
```

## Authentication

- **Public Routes**: GET operations (read-only)
- **Protected Routes**: POST, PUT, DELETE (requires admin authentication)

## Endpoints

### 1. Get All Tahun Data

```
GET /api/infografis/tahun-data
```

**Response:**

```json
{
  "success": true,
  "message": "Data tahun berhasil diambil",
  "data": [
    {
      "id_tahun": 1,
      "tahun": 2024,
      "keterangan": "Data tahun 2024",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id_tahun": 2,
      "tahun": 2023,
      "keterangan": "Data tahun 2023",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Get Tahun Data by ID

```
GET /api/infografis/tahun-data/:id
```

**Parameters:**

- `id` (number, required): ID tahun data

**Response:**

```json
{
  "success": true,
  "message": "Data tahun berhasil diambil",
  "data": {
    "id_tahun": 1,
    "tahun": 2024,
    "keterangan": "Data tahun 2024",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Get Tahun Data by Year Value

```
GET /api/infografis/tahun-data/year/:tahun
```

**Parameters:**

- `tahun` (number, required): Nilai tahun (1900-2100)

**Response:**

```json
{
  "success": true,
  "message": "Data tahun 2024 berhasil diambil",
  "data": {
    "id_tahun": 1,
    "tahun": 2024,
    "keterangan": "Data tahun 2024",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Get Tahun Data with Statistics

```
GET /api/infografis/tahun-data/stats
```

**Response:**

```json
{
  "success": true,
  "message": "Data tahun dengan statistik berhasil diambil",
  "data": [
    {
      "id_tahun": 1,
      "tahun": 2024,
      "keterangan": "Data tahun 2024",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "demografi_count": 1
    },
    {
      "id_tahun": 2,
      "tahun": 2023,
      "keterangan": "Data tahun 2023",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z",
      "demografi_count": 0
    }
  ]
}
```

### 5. Get Years Range

```
GET /api/infografis/tahun-data/range
```

**Response:**

```json
{
  "success": true,
  "message": "Range tahun berhasil diambil",
  "data": {
    "min_year": 2020,
    "max_year": 2024,
    "total_years": 5,
    "available_years": [2020, 2021, 2022, 2023, 2024]
  }
}
```

### 6. Create Tahun Data (Admin Only)

```
POST /api/infografis/tahun-data
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "tahun": 2025,
  "keterangan": "Data tahun 2025"
}
```

**Validation Rules:**

- `tahun`: Required, integer, range 1900-2100, must be unique
- `keterangan`: Optional, string, max 500 characters

**Response:**

```json
{
  "success": true,
  "message": "Data tahun berhasil dibuat",
  "data": {
    "id_tahun": 3,
    "tahun": 2025,
    "keterangan": "Data tahun 2025",
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

### 7. Update Tahun Data (Admin Only)

```
PUT /api/infografis/tahun-data/:id
Authorization: Bearer <token>
```

**Parameters:**

- `id` (number, required): ID tahun data

**Request Body:**

```json
{
  "tahun": 2025,
  "keterangan": "Data tahun 2025 yang diperbarui"
}
```

**Validation Rules:**

- At least one field must be provided
- `tahun`: Optional, integer, range 1900-2100, must be unique
- `keterangan`: Optional, string, max 500 characters

**Response:**

```json
{
  "success": true,
  "message": "Data tahun berhasil diperbarui",
  "data": {
    "id_tahun": 3,
    "tahun": 2025,
    "keterangan": "Data tahun 2025 yang diperbarui",
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T13:00:00.000Z"
  }
}
```

### 8. Delete Tahun Data (Admin Only)

```
DELETE /api/infografis/tahun-data/:id
Authorization: Bearer <token>
```

**Parameters:**

- `id` (number, required): ID tahun data

**Response:**

```json
{
  "success": true,
  "message": "Data tahun berhasil dihapus"
}
```

**Note**: Tahun data tidak dapat dihapus jika masih digunakan di tabel lain (demografi_penduduk, dll).

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Validation error",
  "errors": "Tahun wajib diisi"
}
```

```json
{
  "success": false,
  "message": "Data untuk tahun ini sudah ada"
}
```

```json
{
  "success": false,
  "message": "Data tahun tidak dapat dihapus karena masih digunakan di data demografi penduduk"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Authentication failed. No token provided."
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Forbidden: Access denied"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Data tahun tidak ditemukan"
}
```

```json
{
  "success": false,
  "message": "Data untuk tahun 2025 tidak ditemukan"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Terjadi kesalahan server"
}
```

## Business Rules

1. **Unique Year**: Setiap tahun hanya boleh ada satu record
2. **Range Validation**: Tahun harus dalam range 1900-2100
3. **Referential Integrity**: Tahun tidak dapat dihapus jika masih digunakan di tabel lain
4. **Cascade Effect**: Jika tahun dihapus, semua data terkait akan ikut terhapus (handled by database)

## Usage Examples

### Create Year Data

```bash
curl -X POST http://localhost:3000/api/infografis/tahun-data \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tahun": 2025, "keterangan": "Data tahun 2025"}'
```

### Get All Years with Statistics

```bash
curl http://localhost:3000/api/infografis/tahun-data/stats
```

### Get Available Years Range

```bash
curl http://localhost:3000/api/infografis/tahun-data/range
```

### Update Year Data

```bash
curl -X PUT http://localhost:3000/api/infografis/tahun-data/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"keterangan": "Data tahun yang diperbarui"}'
```

### Delete Year Data

```bash
curl -X DELETE http://localhost:3000/api/infografis/tahun-data/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Integration with Other APIs

Tahun Data API harus digunakan sebelum membuat data infografis lainnya:

1. **Create Year First**: Buat data tahun terlebih dahulu
2. **Create Demographics**: Gunakan `tahun_id` dari response tahun data
3. **Other Statistics**: Semua data statistik menggunakan referensi `tahun_id`

### Example Workflow

```bash
# 1. Create year
POST /api/infografis/tahun-data
{"tahun": 2025, "keterangan": "Data 2025"}

# Response: {"data": {"id_tahun": 5, ...}}

# 2. Create demographics using tahun_id
POST /api/infografis/demografi-penduduk
{"tahun_id": 5, "total_penduduk": 1500, ...}
```
