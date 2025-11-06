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
        <option value="$limit">$limit</option>
        <option value="$skip">$skip</option>
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
        placeholder="Enter stage configuration..."
      ></textarea>
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

const updateStageType = () => {
  const newStage = { [selectedStageType.value]: {} } as any as AggregationStage
  stageJson.value = JSON.stringify(newStage, null, 2)
  emit('update', props.index, newStage)
}

const updateStageFromJson = () => {
  try {
    const parsed = JSON.parse(stageJson.value) as AggregationStage
    emit('update', props.index, parsed)
  } catch (e) {
    // Invalid JSON, ignore
  }
}

watch(() => props.stage, (newStage) => {
  selectedStageType.value = Object.keys(newStage)[0] as string
  stageJson.value = JSON.stringify(newStage, null, 2)
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
