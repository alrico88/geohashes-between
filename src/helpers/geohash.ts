import ngeohash from 'ngeohash';
export type BBox = [number, number, number, number];

/**
 * Gets the BBox of a given geohash
 *
 * @export
 * @param {string} geohash Geohash to find BBox of
 * @return {BBox}  The BBox of the geohash
 */
 export function getGeohashBBox(geohash: string): BBox {
  const [minLat, minLon, maxLat, maxLon] = ngeohash.decode_bbox(geohash);

  return [minLon, minLat, maxLon, maxLat];
}
