"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var logger = console.log.bind(console);
var setLogger = exports.setLogger = function setLogger(fn) {
  logger = fn;
};
var log = exports.log = function log() {
  return logger.apply(undefined, arguments);
};
var capitalize = exports.capitalize = function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
};