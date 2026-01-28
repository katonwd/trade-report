import { readSheet } from '../sheets/readSheet.js';
import { toNumber } from '../utils/money.js';
import { log } from '../utils/logger.js';
import dayjs from 'dayjs';

export async function calcWithdraws(sheetId, start, end) {
  log.step('Calculating WITHDRAWS');

  const rows = await readSheet(sheetId, 'Выводы!A2:B20');
  let sum = 0;

  for (const [dateStr, value] of rows) {
    const date = dayjs(dateStr, ['M/D/YYYY', 'MM/DD/YYYY'], true); // <- тоже исправлено
    if (!date.isValid()) continue;

    if (date.isAfter(end) || date.isBefore(start)) continue;

    sum += toNumber(value);
  }

  log.info(`WITHDRAWS total: ${sum}`);
  return sum;
}