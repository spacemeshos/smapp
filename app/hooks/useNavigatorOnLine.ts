import { useEffect, useState } from 'react';

const getOnLineStatus = () =>
  typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true;

export default () => {
  const [status, setStatus] = useState(getOnLineStatus());

  useEffect(() => {
    function setOnline() {
      setStatus(true);
    }
    function setOffline() {
      setStatus(false);
    }
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, [setStatus]);

  return status;
};
