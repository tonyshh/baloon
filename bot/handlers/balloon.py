# bot/handlers/balloon.py

from aiogram import Router, F, types
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import Command
import json

router = Router()

@router.message(Command("game"))
async def cmd_game(message: types.Message):
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text="Играть 🎈",
                web_app=WebAppInfo(url="https://example.com/index.html")  # ЗАМЕНИ на свой URL
            )
        ]
    ])
    await message.answer("Нажми на кнопку, чтобы начать игру:", reply_markup=keyboard)


@router.message(F.web_app_data)
async def handle_webapp(message: types.Message):
    data = json.loads(message.web_app_data.data)
    hits = data.get("hits", 0)
    total = data.get("total", 0)
    await message.answer(f"🎉 Ты лопнул {hits} из {total} шариков!")
