# Mongo Aggregation Builder

A Vue.js GUI component for building MongoDB aggregation pipelines, inspired by the interface in MongoDB Compass. This is a **web-compatible** package that runs entirely in the browser.

## Demo

Check out the [live demo](https://yourusername.github.io/mongo-aggregation-builder/) to see the component in action.

## Features

- **Visual Pipeline Builder**: Drag-and-drop interface for creating aggregation stages, inspired by MongoDB Compass
- **Complete Stage Support**: All 42 MongoDB aggregation pipeline stages including $match, $group, $lookup, $facet, $search, and more
- **Multiple Views**: Switch between visual Stages View and raw JSON Text View for maximum flexibility
- **Real-time Output**: Generate JSON pipeline and MongoDB query formats instantly as you build
- **Browser Compatible**: Runs entirely in the browser without Node.js dependencies
- **Fully Themeable**: Customize appearance with CSS variables to match your application's design
- **TypeScript Support**: Full TypeScript definitions for all stages and configurations
- **Event-Driven**: Listen to pipeline changes and export events for integration

## Installation

```bash
npm install @rakmaster/mongo-aggregation-builder
```

## Usage

```vue
<template>
  <MongoAggregationBuilder
    :theme="customTheme"
    :initial-pipeline="existingPipeline"
    @pipeline-change="onPipelineChange"
    @export-pipeline="onExportPipeline"
  />
</template>

<script setup>
import { MongoAggregationBuilder } from '@rakmaster/mongo-aggregation-builder'
import '@rakmaster/mongo-aggregation-builder/style'

const existingPipeline = [
  { "$match": { "status": "active" } },
  { "$group": { "_id": "$category", "count": { "$sum": 1 } } }
]

const customTheme = {
  'bg-color': '#1a1a1a',
  'text-color': '#ffffff',
  'button-bg': '#4a9eff'
}

const onPipelineChange = (pipeline) => {
  console.log('Pipeline updated:', pipeline)
  // Save to your backend or local storage
}

const onExportPipeline = (pipeline) => {
  console.log('Export requested:', pipeline)
  // Handle export (copy to clipboard, download file, etc.)
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `ThemeConfig` | `{}` | CSS variables for theming |
| `initialPipeline` | `Pipeline` | `[]` | Initial aggregation pipeline to load |

## Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `pipelineChange` | `pipeline: Pipeline` | Emitted when the pipeline changes |
| `exportPipeline` | `pipeline: Pipeline` | Emitted when export button is clicked |

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

### Vuetify Integration

The component automatically adapts to Vuetify themes when used within a Vuetify application. It will use Vuetify's CSS custom properties as fallback values, so the component will match your Vuetify theme out of the box.

Supported Vuetify theme variables:
- `--v-theme-primary` - Primary color
- `--v-theme-surface` - Background color
- `--v-theme-on-surface` - Text color on surfaces
- `--v-theme-outline` - Border color
- `--v-theme-surface-variant` - Input background
- `--v-theme-error` - Error color
- `--v-theme-error-container` - Error background
- `--v-theme-font` - Font family

## Development

```bash
npm install
npm run dev    # Watch mode
npm run build  # Build for production
```

## License

MIT
