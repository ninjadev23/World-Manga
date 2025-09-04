# Build del frontend
FROM node:20 AS frontend-build

WORKDIR /app/frontend

# Instalar dependencias
COPY frontend/package*.json ./
RUN npm install

# Copiar todo el frontend y hacer build
COPY frontend/ .
RUN npm run build

# Backend
FROM python:3.11-slim AS backend

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    libpq-dev gcc curl \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn dj-database-url whitenoise

# Copiar el backend
COPY . .

# Copiar el build del frontend al static de Django
COPY --from=frontend-build /app/frontend/dist /app/staticfiles

# Crear carpeta para media
RUN mkdir -p /app/media

# Exponer puerto
EXPOSE 8000

# Comando de arranque: solo Gunicorn
CMD gunicorn MangaHubApi.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers 3 \
  --timeout 180