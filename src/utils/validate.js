export const isUrl = (value) => {
  const urlPattern =
    /^(https?:\/\/)?(([\da-z\.-]+)\.([a-z\.]{2,6})|(\d{1,3}\.){3}\d{1,3})(:[0-9]{1,5})?(\/[\w\.-]*)*\/?(\?.*)?(#.*)?$/i;
  return urlPattern.test(value);
};

export const isIP = (value) => {
  const ipPattern = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
  return ipPattern.test(value);
};
