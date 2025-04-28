// db.ts
import Dexie from 'dexie';

const base = new Dexie('database') as Dexie & {};

base.version(1).stores({
  data: `
  ++,
  timestamp,
  metric,
  device`,
});
const db = base.table('data');
export { base, db };
