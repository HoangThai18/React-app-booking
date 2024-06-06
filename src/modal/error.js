export function error(errorCode, msg) {
  return {
    errorCode: errorCode,
    message: msg,
  };
}
