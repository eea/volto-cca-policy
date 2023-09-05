export function getTodayWithTime() {
  const d = new Date();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();

  const output = [
    d.getFullYear(),
    '-',
    month < 10 ? '0' : '',
    month,
    '-',
    day < 10 ? '0' : '',
    day,
    'T',
    hour < 10 ? '0' : '',
    hour,
    ':',
    minute < 10 ? '0' : '',
    minute,
    ':',
    second < 10 ? '0' : '',
    second,
    'Z',
  ].join('');
  return output;
}
