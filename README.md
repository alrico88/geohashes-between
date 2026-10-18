# geohashes-between

Get a list of geohashes between two geohashes, or between two coordinates.

## Installation

Requires Node.js 22 or newer. ESM and CommonJS are supported.

Using npm, `npm i geohashes-between`.

Using yarn, `yarn add geohashes-between`.

## Development

Use Bun 1.4.3 (pinned in `package.json`).

```sh
bun install --frozen-lockfile
bun run check
```

`check` builds the package, validates its exports and types with publint and
Are the Types Wrong, runs Biome and TypeScript, and runs tests with coverage.
Use `bun run lint:fix` to format and apply lint fixes, or `bun run dev` to
rebuild on changes. GitHub Actions runs the same checks.

## Usage

Using `import`

```javascript
import { getGeohashesBetweenTwoGeohashes } from 'geohashes-between';
```

In a CommonJS environment

```javascript
const { getGeohashesBetweenTwoGeohashes } = require('geohashes-between');
```

Then:

```javascript
const list = getGeohashesBetweenTwoGeohashes('ezep', 'ezex');
// list is ['ezer']
```

Or:

```javascript
const pointA = [-3.684166, 40.416763];
const pointB = [-3.720741, 40.364335];

const list = getGeohashesBetweenCoordinates(pointA, pointB, 6);
// list is ['ezjmuj', 'ezjmuh','ezjmu5', 'ezjmgg','ezjmgf', 'ezjmgc','ezjmgb', 'ezjmg8','ezjmex', 'ezjmew','ezjmeq', 'ezjmem','ezjmek']
```

## Table of contents

### Functions

- [getBBoxRingGeohashes](#getbboxringgeohashes)
- [getGeohashesBetweenCoordinates](#getgeohashesbetweencoordinates)
- [getGeohashesBetweenTwoGeohashes](#getgeohashesbetweentwogeohashes)

## Functions

### getBBoxRingGeohashes

▸ **getBBoxRingGeohashes**(`bbox`, `precision`): `string`[]

Find the geohashes of a given precision that form a BBox ring

#### Parameters

| Name        | Type     | Description                         |
| :---------- | :------- | :---------------------------------- |
| `bbox`      | `BBox`   | The BBox to find the ring geohashes |
| `precision` | `number` | Precision for the geohashes         |

#### Returns

`string`[]

Geohashes list

---

### getGeohashesBetweenCoordinates

▸ **getGeohashesBetweenCoordinates**(`pointA`, `pointB`, `precision`): `string`[]

Finds the geohashes of a given precision between two coordinates

**`export`**

#### Parameters

| Name        | Type       | Description                    |
| :---------- | :--------- | :----------------------------- |
| `pointA`    | `Position` | Starting coordinate [lon, lat] |
| `pointB`    | `Position` | End coordinate [lon, lat]      |
| `precision` | `number`   | Desired geohash precision      |

#### Returns

`string`[]

The list of geohashes between those coords

---

### getGeohashesBetweenTwoGeohashes

▸ **getGeohashesBetweenTwoGeohashes**(`geohashStart`, `geohashEnd`, `includeStartEnd?`): `string`[]

Gets a list of geohashes between a starting and end geohash
Both geohashes should be of the same precision

**`export`**

#### Parameters

| Name              | Type      | Default value | Description          |
| :---------------- | :-------- | :------------ | :------------------- |
| `geohashStart`    | `string`  | `undefined`   | The starting geohash |
| `geohashEnd`      | `string`  | `undefined`   | The ending geohash   |
| `includeStartEnd` | `boolean` | `false`       | -                    |

#### Returns

`string`[]

The list of geohashes between start and end
