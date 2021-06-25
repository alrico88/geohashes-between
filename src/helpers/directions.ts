import {NSEW} from 'ngeohash';

export type Direction = 'n' | 'ne' | 'nw' | 's' | 'se' | 'sw' | 'e' | 'w';

export const directions: Record<Direction, NSEW> = {
  n: [1, 0],
  ne: [1, 1],
  nw: [1, -1],
  e: [0, 1],
  w: [0, -1],
  s: [-1, 0],
  sw: [-1, -1],
  se: [-1, 1],
};

/**
 * Checks if a number is between two numbers
 *
 * @param {number} n Number to check if is between
 * @param {number} min Minimum
 * @param {number} max Maximum
 * @return {boolean} Response
 */
function isBetween(n: number, min: number, max: number): boolean {
  return n >= min && n <= max;
}

/**
 * Gets a NSEW string given a certain bearing
 *
 * @export
 * @param {number} bearing The bearing
 * @return {Direction[]} Array of NSEW strings for that direction
 */
export function getDirectionsInBearing(bearing: number): Direction[] {
  if (isBetween(bearing, 0, 90)) {
    return ['n', 'ne', 'e'];
  } else if (isBetween(bearing, 90, 180)) {
    return ['e', 'se', 's'];
  } else if (isBetween(bearing, 180, 270)) {
    return ['s', 'sw', 'w'];
  } else {
    return ['w', 'nw', 'n'];
  }
}
