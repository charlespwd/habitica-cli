let logger = console.log.bind(console);
export const setLogger = (fn) => { logger = fn; };
export const log = (...args) => logger(...args);
export const capitalize = (s) => s[0].toUpperCase() + s.slice(1);
