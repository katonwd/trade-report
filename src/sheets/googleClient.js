import { google } from 'googleapis';
import { log } from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GOOGLE_PRIVATE_KEY) {
  log.error('GOOGLE_PRIVATE_KEY is missing in .env');
  // process.exit(1);
}

log.step('Initializing Google Sheets client');

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

await auth.authorize();

export const sheets = google.sheets({
  version: 'v4',
  auth
});

log.info('Google Sheets client authorized');
