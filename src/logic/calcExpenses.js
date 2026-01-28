import { readSheet } from '../sheets/readSheet.js';
import { toNumber } from '../utils/money.js';
import { log } from '../utils/logger.js';

export async function calcExpenses(sheetId) {
  log.step('Calculating EXPENSES');

  const rows = await readSheet(sheetId, `Расходы!A2:C`);
  let fee = 0;
  let other = 0;

  for (const row of rows) {
    const amount = toNumber(row[1]);
    const note = (row[2] || '').toLowerCase();

    if (!amount) continue;

    if (note.includes('fee')) {
      fee += amount;
    } else {
      other += amount;
    }
  }

  const total = fee + other;

  log.info(`EXPENSES fee=${fee}, other=${other}, total=${total}`);

  return { fee, other, total };
}
