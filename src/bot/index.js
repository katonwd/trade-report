import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

import { handleReportCommand, listenForPeriod } from './commands/report.js';
import { log } from '../utils/logger.js';

log.step('Starting Telegram bot');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true
});

bot.onText(/\/report/, (msg) => {
  log.info(`Command /report from chat ${msg.chat.id}`);
  handleReportCommand(bot, msg);
});

listenForPeriod(bot);

log.info('Telegram bot started and polling');
