# bot/main.py

import os
import asyncio
import logging
from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.client.default import DefaultBotProperties
from handlers.balloon import router as balloon_router
import dotenv

# Загружаем .env из корня проекта (один уровень выше)
dotenv.load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

BOT_TOKEN = os.getenv("BOT_TOKEN")
if not BOT_TOKEN:
    raise RuntimeError("BOT_TOKEN not set in environment")

logging.basicConfig(level=logging.INFO)


async def main():
    bot = Bot(
        token=BOT_TOKEN,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML)
    )
    dp = Dispatcher(storage=MemoryStorage())

    dp.include_router(balloon_router)

    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
