# bot/main.py

import asyncio
import logging
import os

from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage

from handlers.balloon import router as balloon_router

# Загружаем токен из окружения
BOT_TOKEN = os.getenv("BOT_TOKEN")
if not BOT_TOKEN:
    raise RuntimeError("BOT_TOKEN not set in environment")

# Логирование
logging.basicConfig(level=logging.INFO)


async def main():
    bot = Bot(token=BOT_TOKEN, parse_mode=ParseMode.HTML)
    dp = Dispatcher(storage=MemoryStorage())

    # Подключаем роутеры
    dp.include_router(balloon_router)

    # Запускаем бота
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
