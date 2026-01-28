import { readSheet } from '../sheets/readSheet.js';
import { inPeriod } from '../utils/date.js';
import { toNumber } from '../utils/money.js';
import { log } from '../utils/logger.js';

export async function calcNotSold(sheetId, accountName, start, end) {
  log.step(`Calculating NOT SOLD for account ${accountName}`);

  const rows = await readSheet(sheetId, `${accountName}!A2:L`);
  let sum = 0;

  for (const row of rows) {
    const status = row[4];       // E
    const purchaseDate = row[5]; // F
    const sellDate = row[6];     // G
    const amountBuy = row[8];    // I

    if (
      inPeriod(purchaseDate, start, end) &&
      !sellDate &&
      status &&
      status !== 'Sold'
    ) {
      sum += toNumber(amountBuy);
    }
  }

  log.info(`NOT SOLD for ${accountName}: ${sum}`);
  return sum;
}
