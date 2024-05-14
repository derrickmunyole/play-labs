const retry = (func, options={}) => {
  let { retries = 3, delay = 1000, factor = 2 } = options;
  return new Promise((resolve, reject) => {
    const attempt = async () => {
      try {
        const result = await func();
        resolve(result);
      } catch (error) {
        if (retries === 0) {
          reject(error);
        } else {
          const wait = delay * Math.pow(factor, retries);
          setTimeout(() => {
            retries--;
            attempt();
          }, wait);
        }
      }
    };
    attempt();
  });
};

module.exports = retry;