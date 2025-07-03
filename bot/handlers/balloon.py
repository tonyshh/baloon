from aiogram import Router, types
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
import json

router = Router()

@router.message(commands=['game'])
async def cmd_game(message: types.Message):
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(
            text="Лопни шарик 🎈",
            web_app=WebAppInfo(url="https://YOUR_DOMAIN/index.html")
        )]
    ])
    await message.answer("Игра «Лопни шарик»: кликай только по правильным словам!", reply_markup=keyboard)

@router.message(content_types=types.ContentType.WEB_APP_DATA)
async def webapp_result(message: types.Message):
    data = json.loads(message.web_app_data.data)
    hits = data.get('hits', 0)
    total = data.get('total', 0)
    await message.answer(f"🎉 Молодец! Ты лопнул все {hits} шариков из {total}!")
