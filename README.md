# Mongo Aggregation Builder

A Vue.js GUI component for building MongoDB aggregation pipelines, inspired by the interface in MongoDB Compass.

## Demo

Check out the [live demo](https://yourusername.github.io/mongo-aggregation-builder/) to see the component in action.

## Features

- **Visual Pipeline Builder**: Drag-and-drop interface for creating aggregation stages, inspired by MongoDB Compass
- **Complete Stage Support**: All 42 MongoDB aggregation pipeline stages including $match, $group, $lookup, $facet, $search, and more
- **Multiple Views**: Switch between visual Stages View and raw JSON Text View for maximum flexibility
- **Real-time Output**: Generate JSON pipeline and MongoDB query formats instantly as you build
- **Interactive Results**: Connect to live MongoDB instances and see real aggregation results
- **Fully Themeable**: Customize appearance with CSS variables to match your application's design
- **TypeScript Support**: Full TypeScript definitions for all stages and configurations

## Installation

```bash
npm install mongo-aggregation-builder
```

## Usage

```vue
<template>
  <MongoAggregationBuilder
    :connection="mongoConnection"
    :theme="customTheme"
  />
</template>

<script setup>
import { MongoAggregationBuilder } from 'mongo-aggregation-builder'

const mongoConnection = {
  uri: 'mongodb://localhost:27017',
  database: 'myapp',
  collection: 'users'
}

const customTheme = {
  'bg-color': '#1a1a1a',
  'text-color': '#ffffff',
  'button-bg': '#4a9eff'
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `connection` | `ConnectionConfig` | `undefined` | MongoDB connection details for running pipelines |
| `theme` | `ThemeConfig` | `{}` | CSS variables for theming |

### Supported Aggregation Stages

The component supports all 42 MongoDB aggregation pipeline stages:

**Core Stages:**
- `$match`, `$group`, `$project`, `$sort`, `$limit`, `$skip`, `$count`, `$unwind`

**Field Operations:**
- `$addFields`, `$set`, `$unset`, `$replaceRoot`, `$replaceWith`

**Array Operations:**
- `$unwind`

**Join Operations:**
- `$lookup`, `$graphLookup`, `$unionWith`

**Grouping & Bucketing:**
- `$bucket`, `$bucketAuto`, `$sortByCount`, `$facet`

**Geospatial:**
- `$geoNear`

**Search:**
- `$search`, `$searchMeta`

**Output & Merge:**
- `$out`, `$merge`

**Advanced:**
- `$sample`, `$redact`, `$collStats`, `$indexStats`, `$currentOp`, `$listSessions`, `$listLocalSessions`, `$planCacheStats`, `$changeStream`, `$changeStreamSplitLargeEvent`, `$densify`, `$fill`, `$setWindowFields`, `$shardedDataDistribution`, `$documents`

### ThemeConfig

```typescript
interface ThemeConfig {
  [key: string]: string // CSS variable names and values
}
```

## Views

### Stages View
Visual editor with cards for each pipeline stage. Add, edit, delete, and reorder stages.

### Text View
Direct JSON editing of the entire pipeline array.

## Output Formats

### JSON Pipeline
```json
[
  { "$match": { "status": "active" } },
  { "$group": { "_id": "$category", "count": { "$sum": 1 } } }
]
```

### MongoDB Query
```javascript
db.collection.aggregate([
  { "$match": { "status": "active" } },
  { "$group": { "_id": "$category", "count": { "$sum": 1 } } }
])
```

## Theming

Customize the appearance using CSS variables:

```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --button-bg: #007bff;
  --button-hover-bg: #0056b3;
  --border-color: #cccccc;
  --input-bg: #ffffff;
  --error-color: #dc3545;
}
```

## Development

```bash
npm install
npm run dev    # Watch mode
npm run build  # Build for production
```

## License

MIT
