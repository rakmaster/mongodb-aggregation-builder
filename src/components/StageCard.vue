<template>
  <div class="stage-card">
    <div class="stage-header">
      <span class="stage-number">Stage {{ index + 1 }}</span>
      <select v-model="selectedStageType" @change="updateStageType">
        <option value="$match">$match</option>
        <option value="$group">$group</option>
        <option value="$project">$project</option>
        <option value="$sort">$sort</option>
        <option value="$unwind">$unwind</option>
        <option value="$lookup">$lookup</option>
        <option value="$addFields">$addFields</option>
        <option value="$set">$set</option>
        <option value="$unset">$unset</option>
        <option value="$limit">$limit</option>
        <option value="$skip">$skip</option>
        <option value="$count">$count</option>
        <option value="$sortByCount">$sortByCount</option>
        <option value="$bucket">$bucket</option>
        <option value="$bucketAuto">$bucketAuto</option>
        <option value="$facet">$facet</option>
        <option value="$graphLookup">$graphLookup</option>
        <option value="$unionWith">$unionWith</option>
        <option value="$sample">$sample</option>
        <option value="$replaceRoot">$replaceRoot</option>
        <option value="$replaceWith">$replaceWith</option>
        <option value="$out">$out</option>
        <option value="$merge">$merge</option>
        <option value="$redact">$redact</option>
        <option value="$geoNear">$geoNear</option>
        <option value="$search">$search</option>
        <option value="$searchMeta">$searchMeta</option>
        <option value="$changeStream">$changeStream</option>
        <option value="$changeStreamSplitLargeEvent">$changeStreamSplitLargeEvent</option>
        <option value="$collStats">$collStats</option>
        <option value="$currentOp">$currentOp</option>
        <option value="$densify">$densify</option>
        <option value="$documents">$documents</option>
        <option value="$fill">$fill</option>
        <option value="$indexStats">$indexStats</option>
        <option value="$listLocalSessions">$listLocalSessions</option>
        <option value="$listSessions">$listSessions</option>
        <option value="$planCacheStats">$planCacheStats</option>
        <option value="$setWindowFields">$setWindowFields</option>
        <option value="$shardedDataDistribution">$shardedDataDistribution</option>
      </select>
      <div class="stage-actions">
        <button @click="$emit('move-up', index)" :disabled="index === 0">↑</button>
        <button @click="$emit('move-down', index)" :disabled="index === totalStages - 1">↓</button>
        <button @click="$emit('delete', index)">Delete</button>
      </div>
    </div>

    <div class="stage-editor">
      <textarea
        v-model="stageJson"
        @input="updateStageFromJson"
        class="stage-textarea"
        :class="{ 'has-errors': hasErrors }"
        placeholder="Enter stage configuration..."
      ></textarea>

      <div v-if="hasErrors" class="validation-errors">
        <div v-for="error in validationErrors" :key="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>

    <div class="stage-preview" v-if="previewDocuments.length > 0">
      <h4>Preview ({{ previewDocuments.length }} documents)</h4>
      <div class="preview-documents">
        <pre v-for="(doc, idx) in previewDocuments" :key="idx">{{ JSON.stringify(doc, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { AggregationStage } from '../types'
import { validateAggregationPipeline } from '../validation'

interface Props {
  stage: AggregationStage
  index: number
  totalStages: number
  previewDocuments?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  previewDocuments: () => []
})

const emit = defineEmits<{
  update: [index: number, stage: AggregationStage]
  delete: [index: number]
  'move-up': [index: number]
  'move-down': [index: number]
}>()

const selectedStageType = ref<string>(Object.keys(props.stage)[0] || '$match')
const stageJson = ref<string>(JSON.stringify(props.stage, null, 2))
const validationErrors = ref<string[]>([])
const hasErrors = computed(() => validationErrors.value.length > 0)

const updateStageType = () => {
  const newStage = { [selectedStageType.value]: {} } as any as AggregationStage
  stageJson.value = JSON.stringify(newStage, null, 2)
  validateAndUpdate()
}

const updateStageFromJson = () => {
  validateAndUpdate()
}

const validateAndUpdate = () => {
  validationErrors.value = []

  // Wrap single stage in array for validation
  const pipelineJson = `[${stageJson.value}]`
  const validation = validateAggregationPipeline(pipelineJson)

  if (!validation.isValid) {
    validationErrors.value = validation.errors.map(error => error.message)
  } else {
    try {
      const parsed = JSON.parse(stageJson.value) as AggregationStage
      emit('update', props.index, parsed)
    } catch (e) {
      validationErrors.value = ['Invalid JSON syntax']
    }
  }

  // Show warnings too
  if (validation.warnings.length > 0) {
    validation.warnings.forEach(warning => {
      validationErrors.value.push(`Warning: ${warning.message}`)
    })
  }
}

watch(() => props.stage, (newStage) => {
  selectedStageType.value = Object.keys(newStage)[0] as string
  stageJson.value = JSON.stringify(newStage, null, 2)
  validationErrors.value = []
}, { immediate: true })
</script>

<style scoped>
.stage-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: white;
}

.stage-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stage-number {
  font-weight: bold;
}

.stage-actions {
  margin-left: auto;
  display: flex;
  gap: 0.25rem;
}

.stage-textarea {
  width: 100%;
  height: 200px;
  font-family: monospace;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.stage-textarea.has-errors {
  border-color: #dc3545;
}

.validation-errors {
  margin-top: 0.5rem;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  padding: 0.25rem;
  background: #f8d7da;
  border-radius: 3px;
  border-left: 3px solid #dc3545;
}

.stage-preview {
  margin-top: 1rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.preview-documents {
  max-height: 300px;
  overflow-y: auto;
}

.preview-documents pre {
  background: #f5f5f5;
  padding: 0.5rem;
  margin: 0.25rem 0;
  border-radius: 4px;
  font-size: 0.8rem;
}
</style>
