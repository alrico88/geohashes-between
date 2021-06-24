import {decode, encode, neighbor} from 'ngeohash';
import {LineString, Position} from '@turf/helpers';
import {Direction, directions, getDirectionsInBearing} from './helpers/directions';
import {getBearingBetweenPoints} from './helpers/bearing';
import {lineCrossesBBox} from './helpers/clip';
import {getGeohashBBox} from 'bbox-helper-functions';

/**
 * Gets a geohash neighbor in a given direction
 *
 * @param {string} geohash The geohash to find neighbor of
 * @param {Direction} direction The direction in which to look
 * @return {string} The neighbor
 */
function getGeohashNeighborInDirection(geohash: string, direction: Direction): string {
  return neighbor(geohash, directions[direction]);
}

/**
 * Processes a batch of geohashes to see if they intersect a line
 *
 * @param {LineString} lineString A LineString to check if any of the batches geohashes crosses
 * @param {Direction[]} directionsToLookIn What direction to look neighbors in
 * @param {string[]} latestBatch The batch of geohashes to find neighbors of
 * @return {string[]} The list of geohashes that do intersect
 */
function processBatch(lineString: LineString, directionsToLookIn: Direction[], latestBatch: string[]): string[] {
  const geohashesToCheck = latestBatch.reduce((agg, geohash) => {
    directionsToLookIn.forEach((direction) => {
      agg.push(getGeohashNeighborInDirection(geohash, direction));
    });

    return agg;
  }, [] as string[]);

  return geohashesToCheck.filter((geohash) => lineCrossesBBox(lineString, getGeohashBBox(geohash)));
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
  const lineString: LineString = {
    type: 'LineString',
    coordinates: [pointA, pointB],
  };

  const bearing = getBearingBetweenPoints(pointA, pointB);

  const neighborsToLookFor = getDirectionsInBearing(bearing);

  const startingGeohash = encode(pointA[1], pointA[0], precision);
  const endingGeohash = encode(pointB[1], pointB[0], precision);

  const geohashesAlong: Record<string, boolean> = {
    [startingGeohash]: true,
  };

  let latestBatch: string[] = [startingGeohash];

  while (geohashesAlong[endingGeohash] !== true) {
    const batchResults = processBatch(lineString, neighborsToLookFor, latestBatch);
    batchResults.forEach((geohash) => {
      geohashesAlong[geohash] = true;
    });

    latestBatch = batchResults;
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
  if (geohashStart.length !== geohashEnd.length) {
    throw new Error('Both geohashes should be of the same length');
  }

  const pointA = decode(geohashStart);
  const pointB = decode(geohashEnd);

  const geohashesBetween = getGeohashesBetweenCoordinates([pointA.longitude, pointA.latitude], [pointB.longitude, pointB.latitude], geohashStart.length);

  return includeStartEnd === true ? geohashesBetween : geohashesBetween.filter((geohash) => ![geohashStart, geohashEnd].includes(geohash));
}
