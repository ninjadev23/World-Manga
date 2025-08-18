# Build del frontend
FROM node:20 AS frontend-build

WORKDIR /app/frontend

# Instalar dependencias
COPY frontend/package*.json ./
RUN npm install

# Copiar todo el frontend y hacer build
COPY frontend/ .
RUN npm run build

# Gunicorn
FROM python:3.11-slim AS backend

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    libpq-dev gcc nginx curl \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn dj-database-url

# Copiar el backend
COPY . .

# Copiar el build del frontend al static de Django
COPY --from=frontend-build /app/frontend/dist /app/static

# Crear carpeta para media
RUN mkdir -p /app/media

# Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto
EXPOSE 8000

# Comando de arranque: Nginx + Gunicorn
CMD service nginx start && gunicorn MangaHubApi.wsgi:application --bind 0.0.0.0:8000
