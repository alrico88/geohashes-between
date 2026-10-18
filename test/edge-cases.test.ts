import { describe, expect, test } from 'vitest';
import { getGeohashesBetweenCoordinates } from '../src';
import { cloneArray } from '../src/helpers/clone';

describe('Precision validation', () => {
  test.each([0, 13, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects invalid precision %s',
    (precision) => {
      expect(() =>
        getGeohashesBetweenCoordinates([-3.7, 40.4], [-3.6, 40.4], precision),
      ).toThrow('Precision should be a number between 1 and 12');
    },
  );

  test.each([1, 12])('accepts boundary precision %s', (precision) => {
    expect(
      getGeohashesBetweenCoordinates([-3.7, 40.4], [-3.7, 40.4], precision),
    ).toHaveLength(1);
  });
});

describe('cloneArray', () => {
  test.each([{ original: [] }, { original: ['ezep', 'ezex'] }])(
    'creates an independent copy of $original',
    ({ original }) => {
      const cloned = cloneArray(original);

      expect(cloned).toStrictEqual(original);
      expect(cloned).not.toBe(original);
      cloned.push('ezer');
      expect(original).not.toContain('ezer');
    },
  );
});
