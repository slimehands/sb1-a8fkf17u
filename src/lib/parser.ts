const motor_controller_list = ['0x0CF11F05', '0x0CF11E05'];
const mppt_01_list = [
  '0x600',
  '0x601',
  '0x602',
  '0x603',
  '0x604',
  '0x605',
  '0x606',
];
const mppt_02_list = [
  '0x610',
  '0x611',
  '0x612',
  '0x613',
  '0x614',
  '0x615',
  '0x616',
];
//const device_list = ['KLS_01', 'MPPT_01', 'MPPT_02']; //just FYI
export interface CANFrame {
  timestamp: number;
  device: 'KLS_01' | 'MPPT_01' | 'MPPT_02' | ''; // to be changed when two motors
  metric: number;
  data: Uint8Array;
}
export async function parse(line: string): Promise<CANFrame> {
  const datestr =
    line.substring(0, 4) +
    '-' +
    line.substring(5, 7) +
    '-' +
    line.substring(8, 10) +
    'T' +
    line.substring(11, 19);
  const time: Date = new Date(datestr);
  let deviceId: 'KLS_01' | 'MPPT_01' | 'MPPT_02' | '';
  //console.log(datestr);
  //copy and pasted and translated
  const metricIdMatch = (line.match(
    /0x0CF11F05|0x0CF11E05|0x600|0x601|0x602|0x603|0x604|0x605|0x606|0x610|0x611|0x612|0x613|0x614|0x615|0x616/
  ) ?? [' '])[0];
  if (motor_controller_list.includes(metricIdMatch)) {
    deviceId = 'KLS_01';
  } else if (mppt_01_list.includes(metricIdMatch)) {
    deviceId = 'MPPT_01';
  } else if (mppt_02_list.includes(metricIdMatch)) {
    deviceId = 'MPPT_02';
  } else {
    deviceId = '';
  }
  // Match sequences like 0x00 0x1F etc. (at least two or more)
  const hexPattern = /(?:0x[0-9a-fA-F]{2}\s+){1,}0x[0-9a-fA-F]{2}/;
  const match = line.match(hexPattern);
  let bytes: Uint8Array = new Uint8Array([0]);
  if (match) {
    const hexString = match[0];
    const byteArray = hexString.split(/\s+/).map((byte) => parseInt(byte, 16));
    bytes = new Uint8Array(byteArray);
  }
  return {
    timestamp: time.getTime(),
    device: deviceId,
    metric: parseInt(metricIdMatch),
    data: bytes.reverse(), // change this if wrong values.
  };
}

const data = parse(
  '2024/07/16 09:41:44 Extended ID: 0x0CF11E05 DLC: 8 Data: 0xB8 0x0A 0x95 0x00 0x19 0x03 0x00 0x00'
);
//just a test
console.log(JSON.stringify(data));
