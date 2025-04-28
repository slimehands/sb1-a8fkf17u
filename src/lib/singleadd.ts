import { db } from './db';
import { parse, type CANFrame } from './parser';
export async function singleAdd(line: string) {
  const frameLine = await parse(line);
  console.log(frameLine);
  db.add({
    timestamp: frameLine.timestamp,
    metric: frameLine.metric,
    device: frameLine.device,
    data: frameLine.data,
  });
}
