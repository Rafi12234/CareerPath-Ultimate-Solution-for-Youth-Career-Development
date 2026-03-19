#!/bin/bash
# ============================================================
# CareerPath — Docker Entrypoint Script
# Creates .env from environment variables, then starts services
# ============================================================

cd /var/www/html

# Generate .env file from environment variables
cat > .env << EOF
APP_NAME=${APP_NAME:-CareerPath}
APP_ENV=${APP_ENV:-production}
APP_KEY=${APP_KEY:-base64:xKq5w3QMpi6LdKo/aOgUFXJaVG9JYHsHfIo7AuwGl+k=}
APP_DEBUG=${APP_DEBUG:-false}
APP_URL=${APP_URL:-http://localhost:8000}

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=${DB_CONNECTION:-mysql}
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-3306}
DB_DATABASE=${DB_DATABASE:-careerpath}
DB_USERNAME=${DB_USERNAME:-careerpath_user}
DB_PASSWORD=${DB_PASSWORD:-careerpath_pass}

SESSION_DRIVER=${SESSION_DRIVER:-file}
CACHE_DRIVER=${CACHE_DRIVER:-file}
QUEUE_CONNECTION=${QUEUE_CONNECTION:-sync}

SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1,127.0.0.1:8000

OPENAI_API_KEY=${OPENAI_API_KEY:-}
GEMINI_API_KEY=${GEMINI_API_KEY:-}

CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME:-}
CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY:-}
CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET:-}

FILESTACK_API_KEY=${FILESTACK_API_KEY:-}
EOF

# Set permissions
chown www-data:www-data .env
chmod 644 .env

# Suppress PHP 8.4 deprecation notices (Sanctum compatibility)
sed -i 's/^error_reporting = .*/error_reporting = E_ALL \& ~E_DEPRECATED/' /usr/local/etc/php/php.ini-production 2>/dev/null
echo 'error_reporting = E_ALL & ~E_DEPRECATED' > /usr/local/etc/php/conf.d/error-reporting.ini

# Clear and cache config
php artisan config:clear
php artisan config:cache

# Ensure storage directories exist with correct permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

echo "=== .env created, config cached, starting services ==="

# Start supervisor (nginx + php-fpm)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
