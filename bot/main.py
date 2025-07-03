import asyncio
import logging
import os

from aiogram import Bot, Dispatcher
from aiogram.enums.parse_mode import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import BotCommand
from aiogram.webhook.aiohttp_server import SimpleRequestHandler, setup_application
from aiogram.webhook.base import BaseWebhookRequestHandler

from handlers.balloon import router as balloon_router
from aiogram import Router

# Загрузка токена
BOT_TOKEN = os.getenv("BOT_TOKEN")
if not BOT_TOKEN:
    raise RuntimeError("BOT_TOKEN not found in environment")

# Включаем логирование
logging.basicConfig(level=logging.INFO)


async def main():
    bot = Bot(token=BOT_TOKEN, parse_mode=ParseMode.HTML)
    dp = Dispatcher(storage=MemoryStorage())

    # Регистрируем все роутеры
    dp.include_router(balloon_router)

    # Запускаем поллинг
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
