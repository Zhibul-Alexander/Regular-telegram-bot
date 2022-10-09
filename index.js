const TelegramApi = require('node-telegram-bot-api')

const {gameOptions, againOptions} = require('./options')

const token = '5628510011:AAFQE5jurRGk5dKcTPOOTTMb7cAm4W7PA1I'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Бот загадывает цифру от 0 до 9, а ты должен ее угадать!`)
    const randomNumber =  Math.floor(Math.random() * 10).toString()
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Какое число я загадал?', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начать работу'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Игра - угадай цифру'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
            return  bot.sendMessage(chatId, `${msg.from.first_name}, добро пожаловать в телеграм бот!`)
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут - ${msg.from.first_name}, а твой Username в telegram - ${msg.from.username}`)
        }

        if (text === '/game') {
            return startGame(chatId)
        }
        return  bot.sendMessage(chatId, 'Я не понимаю эту команду, попробуй еще раз!')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data === '/again') {
            return startGame(chatId)
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздавляю, ты отгадал цифру ${chats[chatId]}!`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению, ты не смог угадать цифру, бот загадал ${chats[chatId]}`, againOptions)
        }
    })
}

start()