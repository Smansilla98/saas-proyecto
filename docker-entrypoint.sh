#!/bin/bash
set -e

# Configurar variables por defecto
HOST=${HOST:-0.0.0.0}
PORT=${PORT:-8000}
PORT=$((PORT))

# Mapear variables de MySQL de Railway
if [ -n "$MYSQLHOST" ]; then
    export DB_HOST="$MYSQLHOST"
fi
if [ -n "$MYSQLPORT" ]; then
    export DB_PORT="$MYSQLPORT"
fi
if [ -n "$MYSQLDATABASE" ]; then
    export DB_DATABASE="$MYSQLDATABASE"
fi
if [ -n "$MYSQLUSER" ]; then
    export DB_USERNAME="$MYSQLUSER"
fi
if [ -n "$MYSQLPASSWORD" ]; then
    export DB_PASSWORD="$MYSQLPASSWORD"
fi

export DB_CONNECTION=${DB_CONNECTION:-mysql}

# Configurar APP_URL
if [ -z "$APP_URL" ] && [ "$APP_ENV" = "production" ]; then
    export APP_URL="https://proyecto-estudio-production.up.railway.app"
fi

# Forzar HTTPS en producción
if [ "$APP_ENV" = "production" ] || [ -n "$APP_URL" ]; then
    export APP_URL=$(echo "$APP_URL" | sed 's|^http://|https://|')
fi

# Crear directorios
mkdir -p /var/www/html/storage/framework/{sessions,views,cache}
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/bootstrap/cache

# Configurar permisos
chown -R www-data:www-data /var/www/html || true
chmod -R 775 /var/www/html/storage || true
chmod -R 775 /var/www/html/bootstrap/cache || true

# Esperar a que la base de datos esté disponible
echo "Esperando conexión a la base de datos..."
timeout=30
counter=0
db_connected=false

while [ $counter -lt $timeout ] && [ "$db_connected" = false ]; do
    if php -r "
        try {
            \$host = getenv('DB_HOST') ?: '127.0.0.1';
            \$port = getenv('DB_PORT') ?: '3306';
            \$socket = @fsockopen(\$host, \$port, \$errno, \$errstr, 1);
            if (\$socket) {
                fclose(\$socket);
                exit(0);
            }
            exit(1);
        } catch (Exception \$e) {
            exit(1);
        }
    " 2>/dev/null; then
        echo "✓ Conexión a la base de datos establecida"
        db_connected=true
        break
    fi
    echo "Intentando conectar... ($counter/$timeout)"
    sleep 1
    counter=$((counter + 1))
done

if [ "$db_connected" = false ]; then
    echo "⚠ Advertencia: No se pudo verificar la conexión a la base de datos, continuando..."
fi

# Descubrir paquetes
echo "Descubriendo paquetes..."
php artisan package:discover --ansi || true

# Optimizar Laravel
echo "Optimizando Laravel..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Crear enlace simbólico de storage
if [ ! -L /var/www/html/public/storage ]; then
    php artisan storage:link || true
fi

# Ejecutar migraciones
echo "Ejecutando migraciones..."
php artisan migrate --force || {
    echo "Error al ejecutar migraciones"
    exit 1
}

# Iniciar el servidor
echo "Iniciando servidor en ${HOST}:${PORT}..."
exec php artisan serve --host="${HOST}" --port="${PORT}"

