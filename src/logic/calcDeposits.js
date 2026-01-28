import { readSheet } from '../sheets/readSheet.js';
import { toNumber } from '../utils/money.js';
import { log } from '../utils/logger.js';
import dayjs from 'dayjs';

export async function calcDeposits(sheetId, start, end) {
  log.step('Calculating DEPOSITS');

  const rows = await readSheet(sheetId, 'Пополнения!A2:B20');
  let sum = 0;

  for (const [dateStr, value] of rows) {
    const date = dayjs(dateStr, ['M/D/YYYY', 'MM/DD/YYYY'], true); // <- поддержка 1/1/2026 и 01/01/2026
    if (!date.isValid()) continue;

    if (date.isAfter(end) || date.isBefore(start)) continue;

    sum += toNumber(value);
  }

  log.info(`DEPOSITS total: ${sum}`);
  return sum;
}