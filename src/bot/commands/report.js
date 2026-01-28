import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';



import { generateReport } from '../../logic/aggregate.js';
import { log } from '../../utils/logger.js';

dayjs.extend(customParseFormat);

const userStates = new Map();

export function handleReportCommand(bot, msg) {
  const chatId = msg.chat.id;

  log.step(`Waiting for period from chat ${chatId}`);

  userStates.set(chatId, { step: 'WAIT_PERIOD' });

  bot.sendMessage(
    chatId,
    'Введите период в формате:\nMM/DD/YYYY - MM/DD/YYYY'
  );
}

export function listenForPeriod(bot) {
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const state = userStates.get(chatId);

    if (!state || state.step !== 'WAIT_PERIOD') return;

    const text = msg.text;
    log.info(`Received period input: "${text}"`);

    const match = text.match(
      /(\d{1,2}\/\d{1,2}\/\d{4})\s*-\s*(\d{1,2}\/\d{1,2}\/\d{4})/
    );

    if (!match) {
      log.warn('Invalid date format');
      bot.sendMessage(chatId, '❌ Неверный формат даты');
      return;
    }

    const start = dayjs(match[1], 'MM/DD/YYYY');
    const end = dayjs(match[2], 'MM/DD/YYYY');

    log.step(
      `Generating report from ${start.format('MM/DD/YYYY')} to ${end.format('MM/DD/YYYY')}`
    );

    bot.sendMessage(chatId, '⏳ Считаю статистику...');

    try {
      const result = await generateReport(start, end);

      for (const message of result) {
        await bot.sendMessage(chatId, message);
      }

      log.info('Report sent successfully');
    } catch (err) {
      log.error('Failed to generate report', err);
      bot.sendMessage(chatId, '❌ Ошибка при генерации отчёта');
    }

    userStates.delete(chatId);
  });
}
