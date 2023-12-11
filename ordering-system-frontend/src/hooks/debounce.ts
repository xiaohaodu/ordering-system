/**
 * @param {Function} fn
 * @param {number} t milliseconds default 1000ms
 * @return {Function}
 */
export const useDebounce = (fn: Function, t: number = 1000) => {
  let timeout: number;
  return function (...args: Array<any>) {
    console.log(3);

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(async () => await fn(...args), t);
  };
};
