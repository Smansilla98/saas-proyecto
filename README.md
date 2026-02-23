# 🥁 Plataforma La Chilinga - Sistema de Gestión de Contenido

Plataforma web tipo sistema de gestión de contenido para la escuela de percusión "La Chilinga".

## 🚀 Stack Tecnológico

### Backend
- **Laravel 11** - Framework PHP
- **Laravel Sanctum** - Autenticación API
- **Spatie Media Library** - Gestión de archivos multimedia
- **MySQL** - Base de datos
- **S3 Compatible** - Storage para archivos

### Frontend (Próximamente)
- **Next.js 14** (App Router)
- **Tailwind CSS**
- **shadcn/ui**

## 📋 Estructura del Proyecto

```
proyecto-estudio/
├── app/
│   ├── DTOs/              # Data Transfer Objects
│   │   ├── YearDTO.php
│   │   └── RhythmDTO.php
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/       # Controladores API
│   │           ├── AuthController.php
│   │           ├── YearController.php
│   │           ├── RhythmController.php
│   │           └── MediaController.php
│   ├── Models/            # Modelos Eloquent
│   │   ├── User.php
│   │   ├── Year.php
│   │   └── Rhythm.php
│   ├── Policies/         # Políticas de autorización
│   │   ├── YearPolicy.php
│   │   └── RhythmPolicy.php
│   └── Services/         # Lógica de negocio
│       ├── YearService.php
│       └── RhythmService.php
├── database/
│   └── migrations/       # Migraciones
├── routes/
│   └── api.php          # Rutas API
└── Dockerfile           # Configuración Docker
```

## 🗄️ Modelo de Datos

### Users
- `id`, `name`, `email`, `password`
- `role` (admin, docente, alumno)
- `sede`

### Years
- `id`, `name`, `order`
- Relación: `hasMany(Rhythm)`

### Rhythms
- `id`, `name`, `description`, `author`, `adaptation`
- `year_id` (foreign key)
- `optional` (boolean)
- Media Collections: `videos`, `audios`, `pdfs`

## 🔐 Autenticación

### Roles
- **Admin**: Acceso completo (CRUD Years, CRUD Rhythms)
- **Docente**: Puede crear/editar Rhythms
- **Alumno**: Solo lectura de su año

### Endpoints de Autenticación
- `POST /api/login` - Login
- `POST /api/logout` - Logout (requiere auth)
- `GET /api/me` - Usuario actual (requiere auth)

## 📡 API Endpoints

### Years
- `GET /api/years` - Listar años
- `POST /api/years` - Crear año (Admin)
- `GET /api/years/{id}` - Ver año
- `PUT /api/years/{id}` - Actualizar año (Admin)
- `DELETE /api/years/{id}` - Eliminar año (Admin)

### Rhythms
- `GET /api/years/{year}/rhythms` - Listar ritmos de un año
- `POST /api/years/{year}/rhythms` - Crear ritmo (Admin/Docente)
- `GET /api/rhythms/{id}` - Ver ritmo con media
- `PUT /api/rhythms/{id}` - Actualizar ritmo (Admin/Docente)
- `DELETE /api/rhythms/{id}` - Eliminar ritmo (Admin)

### Media
- `POST /api/rhythms/{rhythm}/media/video` - Subir video
- `POST /api/rhythms/{rhythm}/media/audio` - Subir audio
- `POST /api/rhythms/{rhythm}/media/pdf` - Subir PDF
- `DELETE /api/rhythms/{rhythm}/media/{mediaId}` - Eliminar media

## 🐳 Docker

### Build
```bash
docker build -t la-chilinga-api .
```

### Run
```bash
docker run -p 8000:8000 \
  -e DB_HOST=mysql \
  -e DB_DATABASE=chilinga \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=password \
  la-chilinga-api
```

## ⚙️ Configuración

### Variables de Entorno

```env
APP_NAME="La Chilinga"
APP_ENV=production
APP_URL=https://tu-dominio.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=chilinga
DB_USERNAME=root
DB_PASSWORD=

# S3 Compatible Storage
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=
AWS_BUCKET=
AWS_ENDPOINT=  # Para S3 compatible (ej: DigitalOcean Spaces)
AWS_USE_PATH_STYLE_ENDPOINT=false

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000
```

## 📦 Instalación

1. **Clonar y configurar**
```bash
composer install
cp .env.example .env
php artisan key:generate
```

2. **Configurar base de datos**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=chilinga
DB_USERNAME=root
DB_PASSWORD=
```

3. **Ejecutar migraciones**
```bash
php artisan migrate
```

4. **Crear usuario admin**
```bash
php artisan tinker
User::create([
    'name' => 'Admin',
    'email' => 'admin@chilinga.com',
    'password' => bcrypt('password'),
    'role' => 'admin',
]);
```

## 🎯 Próximos Pasos

1. ✅ Backend API completo
2. ⏳ Frontend Next.js 14
3. ⏳ Integración HLS para videos
4. ⏳ PDF Viewer integrado
5. ⏳ Reproductor de audio
6. ⏳ Panel Admin drag & drop

---

**Desarrollado para La Chilinga** 🥁
