import * as React from 'react';
import TimeAgo from 'react-timeago';

import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

const enString = {
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
  wordSeparator: ' '
};

const CustomTimeAgo = ({ time }: { time: string }) => {
  const jsDate = new Date(time).getTime();

  const formatter = buildFormatter(enString);
  return <TimeAgo date={jsDate} formatter={formatter} />;
};

export default CustomTimeAgo;
