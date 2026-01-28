import { readSheet } from '../sheets/readSheet.js';
import { inPeriod } from '../utils/date.js';
import { toNumber } from '../utils/money.js';
import { log } from '../utils/logger.js';

export async function calcBought(sheetId, accountName, start, end) {
  log.step(`Calculating BOUGHT for account ${accountName}`);

  const rows = await readSheet(sheetId, `${accountName}!A2:L`);
  let sum = 0;

  for (const row of rows) {
    const sellDate = row[6];   // G
    const amountBuy = row[8]; // I

    if (inPeriod(sellDate, start, end)) {
      sum += toNumber(amountBuy);
    }
  }
  
  log.info(`BOUGHT for ${accountName}: ${sum}`);
  return sum;
}
