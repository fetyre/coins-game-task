# Название вашего проекта
Task test

## Руководство по запуску

1. Установите все зависимости, используя команду `npm install`.
2. Укажите URL базы данных в файле `.env`:

    ```env
    DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
    ```

3. Выполните генерацию и миграцию Prisma:

    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```

4. Запустите проект, используя команду `npm run start:dev`.

## Документация Open API

После запуска проекта вы можете получить доступ к документации Open API по адресу: http://localhost:3000/api


