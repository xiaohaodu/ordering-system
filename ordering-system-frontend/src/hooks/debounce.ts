/**
 * @param {Function} fn
 * @param {number} t milliseconds default 1000ms
 * @return {Function}
 */
export const useDebounce = (fn: Function, t: number = 1000) => {
  let timeout: number;
  return function (...args: Array<any>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(() => fn(...args), t);
  };
};
