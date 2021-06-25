import {isBetween} from './directions';

/**
 * Validates if precision is a valid precision
 *
 * @export
 * @param {number} precision
 */
export function validatePrecision(precision: number): void {
  if (!isBetween(precision, 1, 12)) {
    throw new Error('Precision should be a number between 1 and 12');
  }
}

/**
 * Validates if both geohashes are the same length
 *
 * @export
 * @param {string} geohashA
 * @param {string} geohashB
 */
export function validateSamePrecisionGeohashes(geohashA: string, geohashB: string): void {
  if (geohashA.length !== geohashB.length) {
    throw new Error('Both geohashes should be of the same length');
  }
}
