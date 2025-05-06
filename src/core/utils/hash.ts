const crypto = require('crypto');
import { normalize_code } from './normalize';

/**
 * Hashes the input string using MD5 after normalizing it. This is the hash used throughout
 * ct-files. The hash removes all whitespace except newlines but standardizes those newlines.
 * Very minor differences might therefore hash to the same value which means some small
 * whitespace changes will be trapped in the project file. This is less likely to be a
 * problem as the disk files can be whatever you want.
 *
 * @param input the string to hash (including newlines and whitespace)
 * @returns the MD5 hash of the normalized string
 */
export function hash(input: string): string {
  const normalized = normalize_code(input).replace(/[ \t]/g, '').replace(/\n+/g, '\n').replace(/^\n|\n$/g, '');
  return crypto.createHash('md5').update(normalized).digest('hex')
}
