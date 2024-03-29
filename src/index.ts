/* eslint-disable no-console */
import ngeohash from 'ngeohash';
import {LineString, Position} from '@turf/helpers';
import {getGeohashNeighborInDirection, getDirectionsInBearing} from './helpers/directions';
import {getBearingBetweenPoints} from './helpers/bearing';
import {lineCrossesBBox} from './helpers/clip';
import {validatePrecision, validateSamePrecisionGeohashes} from './helpers/validator';
import {cloneArray} from './helpers/clone';
import {BBox, getGeohashBBox} from './helpers/geohash';

/**
 * Processes a batch of geohashes to see if they intersect a line
 *
 * @param {LineString} lineString A LineString to check if any of the batches geohashes crosses
 * @param {string[]} latestBatch The batch of geohashes to find neighbors of
 * @return {string[]} The list of geohashes that do intersect
 */
function processBatch(lineString: LineString, latestBatch: string[]): string[] {
  return latestBatch.filter((geohash) => lineCrossesBBox(lineString, getGeohashBBox(geohash)));
}

/**
 * Finds the geohashes of a given precision between two coordinates
 *
 * @export
 * @param {Position} pointA Starting coordinate [lon, lat]
 * @param {Position} pointB End coordinate [lon, lat]
 * @param {number} precision Desired geohash precision
 * @return {string[]} The list of geohashes between those coords
 */
export function getGeohashesBetweenCoordinates(pointA: Position, pointB: Position, precision: number): string[] {
  validatePrecision(precision);

  const lineString: LineString = {
    type: 'LineString',
    coordinates: [pointA, pointB],
  };

  const bearing = getBearingBetweenPoints(pointA, pointB);

  const neighborsToLookFor = getDirectionsInBearing(bearing);

  const startingGeohash = ngeohash.encode(pointA[1], pointA[0], precision);
  const endingGeohash = ngeohash.encode(pointB[1], pointB[0], precision);

  const geohashesAlong: Record<string, boolean> = {
    [startingGeohash]: true,
  };

  let latestBatch: string[] = neighborsToLookFor.map((direction) => getGeohashNeighborInDirection(startingGeohash, direction));

  while (geohashesAlong[endingGeohash] !== true) {
    const batchResults = processBatch(lineString, latestBatch);

    const doNotCheckAgain: string[] = cloneArray(latestBatch);

    const nextBatch: Set<string> = new Set();

    batchResults.forEach((geohash) => {
      geohashesAlong[geohash] = true;

      neighborsToLookFor.forEach((direction) => {
        const lookFor = getGeohashNeighborInDirection(geohash, direction);

        if (!doNotCheckAgain.includes(lookFor)) {
          nextBatch.add(lookFor);
        }
      });
    });

    latestBatch = Array.from(nextBatch);
  }

  return Object.keys(geohashesAlong);
}

/**
 * Gets a list of geohashes between a starting and end geohash
 * Both geohashes should be of the same precision
 *
 * @export
 * @param {string} geohashStart The starting geohash
 * @param {string} geohashEnd The ending geohash
 * @param {boolean} [includeStartEnd=false] Whether to include starting and ending geohash in the returned list
 * @return {string[]} The list of geohashes between start and end
 */
export function getGeohashesBetweenTwoGeohashes(geohashStart: string, geohashEnd: string, includeStartEnd = false): string[] {
  validateSamePrecisionGeohashes(geohashStart, geohashEnd);

  const pointA = ngeohash.decode(geohashStart);
  const pointB = ngeohash.decode(geohashEnd);

  const geohashesBetween = getGeohashesBetweenCoordinates([pointA.longitude, pointA.latitude], [pointB.longitude, pointB.latitude], geohashStart.length);

  return includeStartEnd === true ? geohashesBetween : geohashesBetween.filter((geohash) => ![geohashStart, geohashEnd].includes(geohash));
}

/**
 * Find the geohashes of a given precision that form a BBox ring
 *
 * @export
 * @param {BBox} bbox The BBox to find the ring geohashes
 * @param {number} precision Precision for the geohashes
 * @returns {string[]} Geohashes list
 */
export function getBBoxRingGeohashes(
  bbox: BBox,
  precision: number
): string[] {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const sw = [minLon, minLat];
  const se = [maxLon, minLat];
  const nw = [minLon, maxLat];
  const ne = [maxLon, maxLat];

  const uniqueGeohashes = [
    [nw, ne],
    [ne, se],
    [se, sw],
    [sw, nw],
  ].reduce((acc, coords) => {
    const [start, end] = coords;
    const geohashesBetween = getGeohashesBetweenCoordinates(
      start,
      end,
      precision
    );

    geohashesBetween.forEach((geohash) => {
      acc.add(geohash);
    });

    return acc;
  }, new Set<string>());

  return Array.from(uniqueGeohashes);
}
