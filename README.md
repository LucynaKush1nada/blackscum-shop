# Blackscum Shop — Telegram WebApp

Моно-репозиторий: backend (Express + TS + Prisma) и webapp (Vite + React + TS).

## Быстрый старт

1. Node.js 18+
2. Переменные окружения (создайте файлы вручную):

- Backend (`apps/backend/.env`): `PORT=8080`, `BOT_TOKEN=...`, `DATABASE_URL=...`, `JWT_SECRET=...`
- WebApp (`apps/webapp/.env` опционально): `VITE_API_URL=http://localhost:8080`

3. Установка зависимостей:

```
npm install
```

4. Генерация Prisma Client:

```
npm run prisma:generate -w apps/backend
```

5. Запуск dev (оба приложения):

```
npm run dev
```

- Backend: http://localhost:8080/health
- WebApp: http://localhost:5173

## Telegram

- Откройте WebApp из Telegram бота, чтобы `initData` был доступен
- Эндпоинт проверки: `POST /auth/validate-init`

## Структура

- `apps/backend` — API, `/health`, `/auth/validate-init`, `/tg/webhook`
- `apps/webapp` — React-приложение с SDK `@twa-dev/sdk`

Лицензия: MIT
