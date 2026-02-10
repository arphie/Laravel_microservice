# IP management service Dockerfile

FROM php:8.4-fpm-alpine

# Install system dependencies for SQLite and PHP extensions
RUN apk add --no-cache \
    bash \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite-dev

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_sqlite bcmath

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Expose the port for "php artisan serve"
EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000