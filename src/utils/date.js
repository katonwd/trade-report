import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

// Только американский стиль
const DATE_FORMATS = [
  'MM/DD/YYYY',
  'M/D/YYYY'
];

export function parseDate(value) {
  if (!value) return null;

  for (const format of DATE_FORMATS) {
    const d = dayjs(value, format, true);
    if (d.isValid()) return d;
  }

  // Последний шанс: просто парсим dayjs
  const d = dayjs(value);
  return d.isValid() ? d : null;
}

// Проверка, входит ли дата в период (start и end тоже должны быть dayjs)
export function inPeriod(value, start, end) {
  const date = parseDate(value);
  if (!date) return false;

  return (
    date.isSame(start, 'day') ||
    date.isSame(end, 'day') ||
    (date.isAfter(start) && date.isBefore(end))
  );
}

// Парсим дату из строки американского формата
export function parsePeriod(periodStr) {
  const [startStr, endStr] = periodStr.split('-').map(s => s.trim());
  const start = parseDate(startStr);
  const end = parseDate(endStr);
  return { start, end };
}
