import {BBox, LineString} from 'geojson';
import lineclip from 'lineclip';

/**
 * Checks if a LineString crosses a bbox
 *
 * @export
 * @param {LineString} lineString LineString
 * @param {BBox} bbox The BBox [minLon, minLat, maxLon, maxLat]
 * @return {boolean} True if line crosses BBox
 */
export function lineCrossesBBox(lineString: LineString, bbox: BBox): boolean {
  const clipped = lineclip.polyline(lineString.coordinates, bbox);

  return clipped.length > 0;
}
