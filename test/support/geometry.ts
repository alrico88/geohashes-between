import type { Position } from 'geojson';
import ngeohash from 'ngeohash';
import type { BBox } from '../../src/helpers/geohash';
import { getGeohashBBox } from '../../src/helpers/geohash';

interface GeometryCase {
  name: string;
  from: Position;
  to: Position;
  precision: number;
}

export const geometryCases: GeometryCase[] = [
  {
    name: 'Madrid',
    from: [-3.684166, 40.416763],
    to: [-3.720741, 40.364335],
    precision: 6,
  },
  {
    name: 'Exact corner',
    from: [-5.625, 39.375],
    to: [5.625, 50.625],
    precision: 2,
  },
  { name: 'Horizontal edge', from: [-20, 0], to: [20, 0], precision: 2 },
  { name: 'Vertical edge', from: [0, -20], to: [0, 20], precision: 2 },
  { name: 'Point at a corner', from: [0, 0], to: [0, 0], precision: 2 },
  {
    name: 'Point inside a cell',
    from: [-3.7, 40.4],
    to: [-3.7, 40.4],
    precision: 8,
  },
  {
    name: 'Near a boundary',
    from: [-5.646972656250001, 36.679433365517774],
    to: [-5.52103918210534, 36.67588866176514],
    precision: 5,
  },
  {
    name: 'Previously failing route',
    from: [-90, -66],
    to: [28, -44],
    precision: 2,
  },
  {
    name: 'Antimeridian without wrapping',
    from: [179, 10],
    to: [-179, 11],
    precision: 2,
  },
  { name: 'North pole', from: [-20, 90], to: [20, 90], precision: 2 },
  { name: 'South pole', from: [-20, -90], to: [20, -90], precision: 2 },
  { name: 'Eastern limit', from: [180, -10], to: [180, 10], precision: 2 },
  { name: 'Western limit', from: [-180, -10], to: [-180, 10], precision: 2 },
  { name: 'World corner', from: [180, 90], to: [180, 90], precision: 12 },
  {
    name: 'Endpoint just before a boundary',
    from: [-170, 12],
    to: [-11.250000000000002, 12],
    precision: 2,
  },
  {
    name: 'Endpoint just after a boundary',
    from: [-170, 12],
    to: [-11.249999999999998, 12],
    precision: 2,
  },
];

/**
 * @param from - Segment start in longitude/latitude.
 * @param to - Segment end in longitude/latitude.
 * @param bbox - Closed geohash rectangle.
 * @returns First contact parameter, or undefined when the rectangle is missed.
 */
export function firstContact(
  from: Position,
  to: Position,
  bbox: BBox,
): number | undefined {
  if (
    Math.max(from[0], to[0]) < bbox[0] ||
    Math.min(from[0], to[0]) > bbox[2] ||
    Math.max(from[1], to[1]) < bbox[1] ||
    Math.min(from[1], to[1]) > bbox[3]
  ) {
    return undefined;
  }

  let enter = 0;
  let exit = 1;

  for (const axis of [0, 1] as const) {
    const min = bbox[axis];
    const max = bbox[axis + 2];
    const delta = to[axis] - from[axis];

    if (delta === 0) {
      if (from[axis] < min || from[axis] > max) {
        return undefined;
      }
    } else {
      const a = (min - from[axis]) / delta;
      const b = (max - from[axis]) / delta;

      enter = Math.max(enter, Math.min(a, b));

      exit = Math.min(exit, Math.max(a, b));
    }
  }

  return enter <= exit ? enter : undefined;
}

/**
 * Enumerate a bounding rectangle and test every cell independently of DDA.
 * @param from - Segment start in longitude/latitude.
 * @param to - Segment end in longitude/latitude.
 * @param precision - Geohash precision.
 * @returns Touched hashes ordered by contact time, then column and row.
 */
export function oracle(
  from: Position,
  to: Position,
  precision: number,
): string[] {
  const width = 360 / 2 ** Math.ceil((precision * 5) / 2);
  const height = 180 / 2 ** Math.floor((precision * 5) / 2);
  const minX = Math.max(
    0,
    Math.floor((Math.min(from[0], to[0]) + 180) / width) - 1,
  );
  const maxX = Math.min(
    360 / width - 1,
    Math.floor((Math.max(from[0], to[0]) + 180) / width) + 1,
  );
  const minY = Math.max(
    0,
    Math.floor((Math.min(from[1], to[1]) + 90) / height) - 1,
  );
  const maxY = Math.min(
    180 / height - 1,
    Math.floor((Math.max(from[1], to[1]) + 90) / height) + 1,
  );

  if ((maxX - minX + 1) * (maxY - minY + 1) > 20_000) {
    throw new RangeError(
      'Oracle limited to 20,000 candidate cells; reduce precision or segment length',
    );
  }

  const hits: { hash: string; time: number; x: number; y: number }[] = [];

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const hash = ngeohash.encode(
        -90 + (y + 0.5) * height,
        -180 + (x + 0.5) * width,
        precision,
      );
      const time = firstContact(from, to, getGeohashBBox(hash));

      if (time !== undefined) {
        hits.push({ hash, time, x, y });
      }
    }
  }

  return hits
    .sort((a, b) => a.time - b.time || a.x - b.x || a.y - b.y)
    .map(({ hash }) => hash);
}
