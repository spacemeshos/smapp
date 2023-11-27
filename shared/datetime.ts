export const formatDateAsISO = (date: Date) =>
  date.toISOString().replace(/:/g, '-');

export const getISODate = () => formatDateAsISO(new Date());

export const parseISODate = (iso: string) =>
  new Date(iso.replace(/T(\d{2})-(\d{2})-(\d{2}).(\d+)Z/i, 'T$1:$2:$3.$4Z'));

// E.G. Tuesday, March 3, 2022, 16:50
export const formatDateAsUS = (date: Date) =>
  date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'UTC',
    hourCycle: 'h23',
  });

export const formatISOAsUS = (iso: string) => formatDateAsUS(parseISODate(iso));

export const formatAsDate = (date: Date) =>
  date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export const convertISOToDate = (date: string) =>
  formatAsDate(parseISODate(date));
