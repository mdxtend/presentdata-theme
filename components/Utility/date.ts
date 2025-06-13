import { format, parseISO, isValid } from 'date-fns';

const addOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
};

export const FormattedDate = (
  publishedAt?: string,
  type: 'date' | 'month' | 'year' = 'date'
): string => {
  if (!publishedAt) return 'Unknown date';

  const date = parseISO(publishedAt);
  if (!isValid(date)) return 'Invalid date';

  if (type === 'month') return format(date, 'LLL yyyy');
  if (type === 'year') return format(date, 'yyyy');

  const day = parseInt(format(date, 'd'), 10);
  const dayWithSuffix = addOrdinalSuffix(day);
  return format(date, `LLLL '${dayWithSuffix}', yyyy`);
};
