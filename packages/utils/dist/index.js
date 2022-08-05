'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var log = require('npmlog');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var log__default = /*#__PURE__*/_interopDefaultLegacy(log);

// packages/uilts/index.ts
log__default["default"].level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';
log__default["default"].heading = 'magic';
log__default["default"].addLevel('success', 2000, { fg: 'green', bold: true });

Object.defineProperty(exports, 'log', {
	enumerable: true,
	get: function () { return log__default["default"]; }
});
