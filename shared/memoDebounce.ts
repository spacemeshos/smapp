/**
 * Function that wraps some handler over the incoming data.
 * It calls the handler only for the brand-new data (immediately)
 * or after the `ms` delay, if no newer data was received
 * @param ms delay for calling handler with the same data
 * @param handler function to be called
 * @returns function, that can be used as a handler for events (on data/error/etc)
 */
const memoDebounce = <T>(ms: number, handler: (response: T) => void) => {
  let lastResponse: T | null = null;
  let lastUpdTime = 0;
  let timeout: NodeJS.Timeout;
  return (response: T) => {
    const now = Date.now();
    clearTimeout(timeout);
    const upd = () => {
      lastResponse = response;
      lastUpdTime = now;
      handler(response);
    };
    if (
      JSON.stringify(lastResponse) !== JSON.stringify(response) ||
      lastUpdTime + ms <= now
    ) {
      // If we got a brand-new response
      // or the same but "ms" time already passed
      // then calling handler
      upd();
    } else {
      // Otherwise, we're waiting until "ms" time will pass
      // and only then call handler, if newer data won't come
      // to cancel the timeout
      timeout = setTimeout(() => upd(), ms);
    }
  };
};

export default memoDebounce;
