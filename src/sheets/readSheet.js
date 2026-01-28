import { sheets } from './googleClient.js';
import { log } from '../utils/logger.js';

export async function readSheet(sheetId, range) {
  log.step(`Reading sheet ${sheetId}, range ${range}`);

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range
  });

  const rows = res.data.values || [];
  log.info(`Fetched ${rows.length} rows from ${range}`);

  return rows;
}
