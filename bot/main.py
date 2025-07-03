from aiogram import Bot, Dispatcher, executor
from aiogram.filters import Command
from handlers.balloon import router as balloon_router
import os

API_TOKEN = os.getenv("BOT_TOKEN")

bot = Bot(token=API_TOKEN)
dp = Dispatcher()
dp.include_router(balloon_router)

if __name__ == "__main__":
    executor.start_polling(dp, skip_updates=True)
