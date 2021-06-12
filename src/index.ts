import {neighbor as getNeighbor, NSEW} from 'ngeohash';

export type Direction = 'n' | 'ne' | 'nw' | 's' | 'se' | 'sw' | 'e' | 'w';

const directions: Record<Direction, NSEW> = {
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
 * Gets a list of geohashes between a starting and end geohash, in a given direction
 * Be careful if both geohashes are not in the same grid, as this function will run indefinitely
 *
 * @export
 * @param {string} geohashStart The starting geohash
 * @param {string} geohashEnd The ending geohash
 * @param {Direction} direction The direction to use to calculate the next neighboring geohash between those two
 * @param {boolean} [includeStartEnd=false] Whether to include starting and ending geohash in the returned list
 * @return {string[]} The list of geohashes between start and end
 */
export function getGeohashesBetween(geohashStart: string, geohashEnd: string, direction: Direction, includeStartEnd = false): string[] {
  let currGeohash: string = geohashStart;

  const geohashesBetween: string[] = [];

  if (includeStartEnd) {
    geohashesBetween.push(geohashStart, geohashEnd);
  }

  while (currGeohash !== geohashEnd) {
    currGeohash = getNeighbor(currGeohash, directions[direction]);

    if (currGeohash === geohashEnd) {
      break;
    } else {
      geohashesBetween.push(currGeohash);
    }
  }

  return geohashesBetween;
}
