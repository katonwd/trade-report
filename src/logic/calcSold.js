import { readSheet } from '../sheets/readSheet.js';
import { inPeriod } from '../utils/date.js';
import { toNumber } from '../utils/money.js';
import { log } from '../utils/logger.js';

export async function calcSold(sheetId, accountName, start, end) {
  log.step(`Calculating SOLD for account ${accountName}`);

  const rows = await readSheet(sheetId, `${accountName}!A2:L`);
  let sum = 0;

  for (const row of rows) {
    const sellDate = row[6];    // G
    const amountSell = row[11]; // L

    if (inPeriod(sellDate, start, end)) {
      sum += toNumber(amountSell);
    }
  }

  log.info(`SOLD for ${accountName}: ${sum}`);
  return sum;
}
