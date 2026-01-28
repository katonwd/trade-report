import accounts from '../config/accounts.json' with { type: 'json' };

import { calcBought } from './calcBought.js';
import { calcSold } from './calcSold.js';
import { calcNotSold } from './calcNotSold.js';
import { calcDeposits } from './calcDeposits.js';
import { calcWithdraws } from './calcWithdraws.js';
import { calcExpenses } from './calcExpenses.js';

import { log } from '../utils/logger.js';

export async function generateReport(start, end) {
  log.step('Starting FULL report aggregation');

  const messages = [];

  for (const key of Object.keys(accounts)) {
    const owner = accounts[key];
    const sheetId = process.env[owner.sheetEnv];

    log.step(`Processing owner: ${owner.owner}`);

    let bought = 0;
    let sold = 0;
    let notSold = 0;

    for (const account of owner.accounts) {
      bought += await calcBought(sheetId, account, start, end);
      sold += await calcSold(sheetId, account, start, end);
      notSold += await calcNotSold(sheetId, account, start, end);
    }

    const deposits = await calcDeposits(sheetId, start, end);
    const withdraws = await calcWithdraws(sheetId, start, end);
    const expenses = await calcExpenses(sheetId);

    const profit = sold - expenses.total - bought;
    const profitPercent = bought ? (profit / bought) * 100 : 0;

    const message =
`📊 Статистика — ${owner.owner}
Период: ${start.format('MM/DD/YYYY')} – ${end.format('MM/DD/YYYY')}

Куплено: $${bought.toFixed(2)}
Продано: $${sold.toFixed(2)}

Расходы:
  Fee: $${expenses.fee.toFixed(2)}
  Прочее: $${expenses.other.toFixed(2)}
  Total: $${expenses.total.toFixed(2)}

${profit > 0
  ? `Профит: $${profit.toFixed(2)} (+${profitPercent.toFixed(2)}%)`
  : `Профит: $${profit.toFixed(2)} (${profitPercent.toFixed(2)}%) 🤡`
}

Не получилось продать: $${notSold.toFixed(2)}
Пополнено: $${deposits.toFixed(2)}
Выведено: $${withdraws.toFixed(2)}


`;

    messages.push(message);
  }

  log.info('FULL report generation finished');
  return messages;
}
