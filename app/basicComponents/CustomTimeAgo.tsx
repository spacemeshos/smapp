import * as React from 'react';
import TimeAgo from 'react-timeago';

import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

export type FormatterKeys =
  | 'prefixAgo'
  | 'prefixFromNow'
  | 'suffixAgo'
  | 'suffixFromNow'
  | 'seconds'
  | 'minute'
  | 'minutes'
  | 'hour'
  | 'hours'
  | 'day'
  | 'days'
  | 'month'
  | 'months'
  | 'year'
  | 'years'
  | 'wordSeparator';
export type FormatterDict = Record<FormatterKeys, string | null>;

const enString: FormatterDict = {
  prefixAgo: null,
  prefixFromNow: null,
  suffixAgo: 'ago',
  suffixFromNow: 'from now',
  seconds: 'few secs',
  minute: 'a min',
  minutes: '%d min',
  hour: '1 hr',
  hours: '%d hrs',
  day: '1 day',
  days: '%d days',
  month: '1 month',
  months: '%d months',
  year: '1 year',
  years: '%d years',
  wordSeparator: ' ',
};

const CustomTimeAgo = ({
  time,
  dict = {},
}: {
  time: number | string;
  dict?: Partial<FormatterDict>;
}) => {
  const jsDate = typeof time === 'number' ? time : new Date(time).getTime();
  const formatter = buildFormatter({ ...enString, ...dict });
  return <TimeAgo date={jsDate} formatter={formatter} />;
};

export default CustomTimeAgo;
