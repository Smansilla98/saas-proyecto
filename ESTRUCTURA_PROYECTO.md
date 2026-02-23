# 📐 Estructura del Proyecto - La Chilinga

## ✅ Backend Completado

### 📦 Dependencias Instaladas
- ✅ Laravel 11
- ✅ Laravel Sanctum (v4.3.1)
- ✅ Spatie Media Library (v11.21.0)
- ✅ AWS S3 SDK (v3.31.0)

### 🗄️ Base de Datos

#### Migraciones Creadas
1. **users** (modificada)
   - `role` (enum: admin, docente, alumno)
   - `sede` (string, nullable)

2. **years**
   - `name` (string)
   - `order` (integer, unique)

3. **rhythms**
   - `name` (string)
   - `description` (text, nullable)
   - `author` (string, nullable)
   - `adaptation` (string, nullable)
   - `year_id` (foreign key)
   - `optional` (boolean)

4. **media** (Spatie Media Library)
   - Tabla automática para gestionar archivos

### 📁 Modelos

#### User
- Métodos: `isAdmin()`, `isDocente()`, `isAlumno()`
- Fillable: `name`, `email`, `password`, `role`, `sede`

#### Year
- Relación: `hasMany(Rhythm)`
- Scope: `ordered()`

#### Rhythm
- Implementa `HasMedia` (Spatie)
- Relación: `belongsTo(Year)`
- Collections: `videos`, `audios`, `pdfs`
- Métodos: `getVideos()`, `getAudios()`, `getPdfs()`

### 🎯 DTOs

#### YearDTO
- `name`, `order`
- Métodos: `fromArray()`, `toArray()`

#### RhythmDTO
- `name`, `yearId`, `description`, `author`, `adaptation`, `optional`
- Métodos: `fromArray()`, `toArray()`

### 🔧 Services

#### YearService
- `getAll()`, `getById()`, `create()`, `update()`, `delete()`

#### RhythmService
- `getByYear()`, `getById()`, `create()`, `update()`, `delete()`
- `addVideo()`, `addAudio()`, `addPdf()`

### 🛡️ Policies

#### YearPolicy
- `viewAny()`: Todos
- `view()`: Todos (filtrado por año para alumnos)
- `create()`: Solo Admin
- `update()`: Solo Admin
- `delete()`: Solo Admin

#### RhythmPolicy
- `viewAny()`: Todos
- `view()`: Todos (filtrado por año para alumnos)
- `create()`: Admin y Docente
- `update()`: Admin y Docente
- `delete()`: Solo Admin

### 🎮 Controladores API

#### AuthController
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/me` - Usuario actual

#### YearController
- `GET /api/years` - Listar
- `POST /api/years` - Crear
- `GET /api/years/{id}` - Ver
- `PUT /api/years/{id}` - Actualizar
- `DELETE /api/years/{id}` - Eliminar

#### RhythmController
- `GET /api/years/{year}/rhythms` - Listar por año
- `POST /api/years/{year}/rhythms` - Crear
- `GET /api/rhythms/{id}` - Ver con media
- `PUT /api/rhythms/{id}` - Actualizar
- `DELETE /api/rhythms/{id}` - Eliminar

#### MediaController
- `POST /api/rhythms/{rhythm}/media/video` - Subir video
- `POST /api/rhythms/{rhythm}/media/audio` - Subir audio
- `POST /api/rhythms/{rhythm}/media/pdf` - Subir PDF
- `DELETE /api/rhythms/{rhythm}/media/{mediaId}` - Eliminar

### 🛣️ Rutas API

Configuradas en `routes/api.php`:
- Rutas públicas: `/api/login`
- Rutas protegidas: Todas las demás con `auth:sanctum`

### 🐳 Docker

#### Dockerfile
- PHP 8.2 FPM
- Extensiones: pdo_mysql, mbstring, exif, pcntl, bcmath, gd, zip, intl
- Límites: 200MB upload, 300s execution time
- Optimizado para producción

#### docker-entrypoint.sh
- Configuración automática de variables Railway
- Espera conexión a BD
- Ejecuta migraciones
- Optimiza Laravel

### ☁️ Storage

#### Configuración S3
- Disco `s3` configurado en `config/filesystems.php`
- Variables de entorno para AWS/S3 compatible
- Spatie Media Library usa el disco configurado

## 📝 Próximos Pasos

### Frontend (Next.js 14)
1. Crear proyecto Next.js
2. Configurar Tailwind + shadcn/ui
3. Implementar autenticación
4. Dashboard Admin
5. Panel Alumno
6. Reproductores multimedia

### Mejoras Backend
1. Implementar filtrado por año para alumnos
2. Agregar relación User-Year para alumnos
3. Optimizar queries con eager loading
4. Agregar validaciones adicionales
5. Implementar HLS para videos grandes

---

**Estado**: ✅ Backend API completo y funcional

