#!/bin/bash

set -e

echo "🚀 CareerPath - Starting Docker Environment"

PORT_VALUE="${PORT:-8000}"

# Render assigns PORT dynamically; patch the Nginx listen port before startup.
sed -i "s/__PORT__/${PORT_VALUE}/g" /etc/nginx/sites-available/default

# Create .env file if it doesn't exist
if [ ! -f /var/www/html/.env ]; then
    echo "📝 Creating .env file..."
    cp /var/www/html/.env.docker /var/www/html/.env
fi

# Generate Laravel app key if not set
if ! grep -q "^APP_KEY=base64:" /var/www/html/.env; then
    echo "🔑 Generating Laravel app key..."
    cd /var/www/html
    php artisan key:generate
fi

# Run database migrations
echo "🗄️  Running database migrations..."
cd /var/www/html
php artisan migrate --force

# Clear caches
echo "🧹 Clearing caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ Setup complete!"
echo "🌐 Application running on port ${PORT_VALUE}"
echo "⚛️  Frontend running at http://localhost:3000"

# Start supervisor to manage PHP-FPM and Nginx
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
