export const log = {
  info: (msg) => console.log(`ℹ️  [INFO] ${msg}`),
  step: (msg) => console.log(`➡️  [STEP] ${msg}`),
  warn: (msg) => console.warn(`⚠️  [WARN] ${msg}`),
  error: (msg, err) => {
    console.error(`❌ [ERROR] ${msg}`);
    if (err) console.error(err);
  }
};
