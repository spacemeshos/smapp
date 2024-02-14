import React from 'react';
import reactStringReplace from 'react-string-replace';
import { Link } from '../basicComponents';

export default (input: string) =>
  reactStringReplace(input, /(<a href="[^"]*">.+<\/a>)/g, (match, i) => {
    const data = match.match(/<a href="([^"]*)">(.+)<\/a>/);
    const url = data?.[1];
    const text = data?.[2];
    if (!url || !text) return match;
    const openLink = (e: React.MouseEvent) => {
      e.stopPropagation();
      window.open(url);
    };
    return (
      <Link
        key={`link_${i}`}
        onClick={openLink}
        text={text}
        style={{ display: 'inline-block' }}
      />
    );
  });
