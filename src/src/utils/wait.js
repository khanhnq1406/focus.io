export const wait = function (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const sleep = function (ms) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < ms);
};
