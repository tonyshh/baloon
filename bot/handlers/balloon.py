from aiogram import Router, types
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
import json

router = Router()

@router.message(commands=["game"])
async def cmd_game(message: types.Message):
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text="Играть 🎈",
                web_app=WebAppInfo(url="https://example.com/index.html")  # замени на свой
            )
        ]
    ])
    await message.answer("Нажми, чтобы начать игру:", reply_markup=keyboard)

@router.message(lambda m: m.web_app_data)
async def handle_webapp(message: types.Message):
    data = json.loads(message.web_app_data.data)
    await message.answer(f"🎉 Ты лопнул {data.get('hits')} из {data.get('total')} шариков!")
