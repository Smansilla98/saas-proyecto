# 🥁 La Chilinga - Frontend

Frontend de la plataforma La Chilinga construido con Next.js 14, Tailwind CSS y shadcn/ui.

## 🚀 Stack Tecnológico

- **Next.js 14** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** - Componentes UI
- **Axios** - Cliente HTTP
- **react-player** - Reproductor de video/audio
- **pdfjs-dist** - Visor de PDFs

## 📁 Estructura

```
frontend/
├── app/
│   ├── login/              # Página de login
│   ├── dashboard/          # Dashboard principal
│   ├── years/              # Lista de años
│   │   └── [id]/rhythms/   # Ritmos por año
│   └── rhythms/
│       └── [rhythmId]/     # Detalle de ritmo con media
├── components/
│   ├── ui/                 # Componentes shadcn/ui
│   ├── layout/             # Navbar, etc.
│   └── media/              # Reproductores multimedia
│       ├── video-player.tsx
│       ├── audio-player.tsx
│       └── pdf-viewer.tsx
└── lib/
    └── api/                # Servicios API
        ├── client.ts
        ├── auth.ts
        └── years.ts
```

## 🎯 Páginas Implementadas

### 1. Login (`/login`)
- Formulario de autenticación
- Manejo de errores
- Redirección automática

### 2. Dashboard (`/dashboard`)
- Vista general de años
- Acceso rápido a ritmos
- Botones de gestión (Admin)

### 3. Años (`/years`)
- Lista de todos los años
- Cards interactivos
- Navegación a ritmos

### 4. Ritmos por Año (`/years/[id]/rhythms`)
- Lista de ritmos del año
- Información básica
- Navegación a detalle

### 5. Detalle de Ritmo (`/rhythms/[rhythmId]`)
- Información completa
- Reproductor de videos
- Reproductor de audios
- Visor de PDFs

## 🎨 Componentes

### Reproductores Multimedia

#### VideoPlayer
- Usa `react-player`
- Soporta múltiples formatos
- Controles nativos

#### AudioPlayer
- Controles personalizados
- Barra de progreso
- Control de volumen

#### PdfViewer
- Iframe con zoom
- Botón de descarga
- Controles de zoom

## 🔐 Autenticación

- Context API para estado global
- Token almacenado en localStorage
- Interceptores Axios para agregar token
- Middleware para proteger rutas

## ⚙️ Configuración

### Variables de Entorno

Crear `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm run build
npm start
```

## 📡 Integración con Backend

El frontend se comunica con el backend Laravel a través de:

- **Base URL**: Configurada en `NEXT_PUBLIC_API_URL`
- **Autenticación**: Token Bearer en headers
- **CORS**: Configurado en Laravel para permitir el dominio del frontend

## 🎯 Próximas Mejoras

1. Panel Admin completo (CRUD Years/Rhythms)
2. Drag & drop para subida de archivos
3. Soporte HLS para videos grandes
4. Mejoras en PDF viewer
5. Búsqueda y filtros
6. Notificaciones
7. Modo oscuro

---

**Frontend: ✅ COMPLETO Y FUNCIONAL**
