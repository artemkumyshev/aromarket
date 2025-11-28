# Переменные окружения

Полное руководство по переменным окружения в проекте Fullstack Starter Template.

## 📁 Структура .env файлов

Проект использует три уровня переменных окружения:

1. **Корневой `.env`** - для Docker Compose (настройка всех сервисов)
2. **`backend/.env`** - для backend приложения (NestJS)
3. **`frontend/.env`** - для frontend приложения (Vite/React)

## 🔄 Приоритет загрузки

Переменные загружаются в следующем порядке приоритета:

1. **Переменные из `.env` файлов** (высший приоритет)
2. **Переменные из Docker Compose** (для контейнеров)
3. **Значения по умолчанию** в коде (низший приоритет)

## 📋 Переменные по категориям

### База данных

| Переменная | Описание | По умолчанию | Где используется |
|------------|----------|--------------|------------------|
| `DB_NAME` | Имя базы данных | `app_cms` | Docker Compose |
| `DB_USER` | Пользователь БД | `app_user` | Docker Compose |
| `DB_PASSWORD` | Пароль БД | `app_password` | Docker Compose |
| `DB_PORT` | Порт PostgreSQL | `5432` | Docker Compose |
| `DATABASE_URL` | Полный URL подключения | - | Backend |

**Пример:**
```env
DATABASE_URL=postgresql://app_user:app_password@localhost:5432/app_cms
```

### Backend (NestJS)

| Переменная | Описание | По умолчанию | Где используется |
|------------|----------|--------------|------------------|
| `PORT` | Порт сервера | `3000` | Backend |
| `NODE_ENV` | Окружение | `development` | Backend, Docker |
| `JWT_SECRET` | Секретный ключ для JWT | - | Backend |
| `JWT_EXPIRES_IN` | Время жизни JWT токена | `24h` | Backend |
| `CORS_ORIGIN` | Разрешенные источники | `http://localhost:5173` | Backend |
| `CORS_CREDENTIALS` | Разрешить credentials | `true` | Backend |
| `LOG_LEVEL` | Уровень логирования | `debug` | Backend |
| `SWAGGER_TITLE` | Заголовок Swagger | `Fullstack Starter API` | Backend |
| `SWAGGER_DESCRIPTION` | Описание Swagger | `Fullstack Starter Template API Documentation` | Backend |
| `SWAGGER_VERSION` | Версия API | `1.0` | Backend |
| `SWAGGER_PATH` | Путь к Swagger UI | `api/docs` | Backend |
| `HEALTH_CHECK_PATH` | Путь health check | `/health` | Backend |

### Frontend (Vite/React)

**Важно**: Vite требует префикс `VITE_` для переменных, доступных в клиентском коде.

| Переменная | Описание | По умолчанию | Где используется |
|------------|----------|--------------|------------------|
| `VITE_API_BASE_URL` | Базовый URL API | `http://localhost:3000` | Frontend |
| `VITE_APP_TITLE` | Название приложения | `Fullstack Application` | Frontend |
| `VITE_APP_VERSION` | Версия приложения | `0.0.1` | Frontend |
| `VITE_APP_DESCRIPTION` | Описание приложения | `Fullstack Starter Template` | Frontend |
| `VITE_HOST` | Хост dev сервера | `localhost` | Vite config |
| `VITE_PORT` | Порт dev сервера | `5173` | Vite config |
| `VITE_STRICT_PORT` | Строгая проверка порта | `false` | Vite config |
| `VITE_ENABLE_ANALYTICS` | Включить аналитику | `false` | Frontend |
| `VITE_ENABLE_DEBUG` | Режим отладки | `true` | Frontend |

### Docker Compose

| Переменная | Описание | По умолчанию | Где используется |
|------------|----------|--------------|------------------|
| `BACKEND_PORT` | Порт backend | `3000` | Docker Compose |
| `FRONTEND_PORT` | Порт frontend | `5173` | Docker Compose |
| `BACKEND_CONTAINER_NAME` | Имя контейнера backend | `app-cms-backend` | Docker Compose |
| `FRONTEND_CONTAINER_NAME` | Имя контейнера frontend | `app-cms-frontend` | Docker Compose |
| `DATABASE_CONTAINER_NAME` | Имя контейнера БД | `app-cms-db` | Docker Compose |
| `PGADMIN_CONTAINER_NAME` | Имя контейнера pgAdmin | `app-cms-pgadmin` | Docker Compose |

### pgAdmin

| Переменная | Описание | По умолчанию | Где используется |
|------------|----------|--------------|------------------|
| `PGADMIN_PORT` | Порт pgAdmin | `5050` | Docker Compose |
| `PGADMIN_EMAIL` | Email для входа | `admin@example.com` | Docker Compose |
| `PGADMIN_PASSWORD` | Пароль для входа | `admin` | Docker Compose |
| `PGADMIN_SERVER_MODE` | Режим сервера | `False` | Docker Compose |
| `PGADMIN_MASTER_PASSWORD_REQUIRED` | Требовать master пароль | `False` | Docker Compose |

### Nginx (Production)

| Переменная | Описание | По умолчанию | Где используется |
|------------|----------|--------------|------------------|
| `NGINX_SERVER_NAME` | Имя сервера | `localhost` | Nginx template |
| `NGINX_BACKEND_HOST` | Хост backend | `backend` | Nginx template |
| `NGINX_BACKEND_PORT` | Порт backend | `3000` | Nginx template |
| `NGINX_SECURITY_CONTACT` | Контакт для security.txt | `artemkumyshev@gmail.com` | Nginx template |
| `NGINX_HTTP_PORT` | HTTP порт | `80` | Docker Compose |
| `NGINX_HTTPS_PORT` | HTTPS порт | `443` | Docker Compose |

### Ресурсы (Production)

| Переменная | Описание | По умолчанию | Где используется |
|------------|----------|--------------|------------------|
| `DB_MEMORY_LIMIT` | Лимит памяти БД | `1G` | Docker Compose |
| `DB_MEMORY_RESERVATION` | Резерв памяти БД | `512M` | Docker Compose |
| `BACKEND_MEMORY_LIMIT` | Лимит памяти backend | `1G` | Docker Compose |
| `BACKEND_MEMORY_RESERVATION` | Резерв памяти backend | `512M` | Docker Compose |
| `BACKEND_REPLICAS` | Количество реплик backend | `2` | Docker Compose |
| `FRONTEND_MEMORY_LIMIT` | Лимит памяти frontend | `256M` | Docker Compose |
| `FRONTEND_MEMORY_RESERVATION` | Резерв памяти frontend | `128M` | Docker Compose |
| `PGADMIN_MEMORY_LIMIT` | Лимит памяти pgAdmin | `512M` | Docker Compose |
| `PGADMIN_MEMORY_RESERVATION` | Резерв памяти pgAdmin | `256M` | Docker Compose |

### Load Balancer

| Переменная | Описание | По умолчанию | Где используется |
|------------|----------|--------------|------------------|
| `LOADBALANCER_CONTAINER_NAME` | Имя контейнера LB | `app-cms-lb` | Docker Compose |
| `HAPROXY_PORT` | Порт HAProxy | `8080` | Docker Compose |
| `HAPROXY_STATS_PORT` | Порт статистики HAProxy | `9000` | Docker Compose |

## 🚀 Быстрый старт

### 1. Создайте .env файлы

```bash
# Корневой для Docker Compose
cp .env.example .env

# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 2. Отредактируйте значения

Откройте созданные `.env` файлы и заполните значениями для вашего окружения.

### 3. Запустите проект

```bash
# С Docker
docker-compose up -d

# Или локально
npm run dev
```

## 🔒 Безопасность

### ⚠️ Важные правила

1. **Никогда не коммитьте `.env` файлы** в Git
2. **Используйте сильные пароли** для продакшена
3. **Храните секреты** в безопасном месте (например, в секретах CI/CD)
4. **Используйте разные значения** для разных окружений

### Рекомендации

- Используйте генераторы паролей для `JWT_SECRET` и `DB_PASSWORD`
- Регулярно ротируйте секретные ключи
- Используйте переменные окружения вашей платформы (Heroku, AWS, etc.) для продакшена

## 📝 Примеры конфигурации

### Development

```env
# .env
NODE_ENV=development
LOG_LEVEL=debug
VITE_ENABLE_DEBUG=true
```

### Production

```env
# .env
NODE_ENV=production
LOG_LEVEL=info
JWT_SECRET=<strong-random-secret>
DB_PASSWORD=<strong-password>
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=true
```

## 🔍 Проверка переменных

### Backend

```bash
# Проверить загруженные переменные
cd backend
node -e "require('dotenv').config(); console.log(process.env)"
```

### Frontend

Переменные доступны через `import.meta.env`:

```typescript
console.log(import.meta.env.VITE_API_BASE_URL);
console.log(import.meta.env.VITE_APP_TITLE);
```

### Docker Compose

```bash
# Проверить переменные перед запуском
docker-compose config
```

## 📚 Дополнительная информация

- [NestJS Configuration](https://docs.nestjs.com/techniques/configuration)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Docker Compose Environment Variables](https://docs.docker.com/compose/environment-variables/)

