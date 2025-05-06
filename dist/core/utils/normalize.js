"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize_code = void 0;
/**
 * Normalizes the input string, making all newlines UNIX-style and
 * converting all tabs to four spaces. This is consistent with
 * ct.js's formatting rules.
 *
 * @param input the string to normalize (including newlines and whitespace)
 * @returns the normalized code
 */
function normalize_code(input) {
    return input.replace(/\t/g, '    ').replace(/\r\n|\r/g, '\n');
}
exports.normalize_code = normalize_code;
