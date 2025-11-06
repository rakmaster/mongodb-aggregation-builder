<template>
  <div class="mongo-aggregation-builder">
    <div class="toolbar">
      <button @click="addStage">Add Stage</button>
      <button @click="exportPipeline">Export Pipeline</button>
      <select v-model="viewMode">
        <option value="stages">Stages View</option>
        <option value="text">Text View</option>
      </select>
    </div>

    <div v-if="viewMode === 'stages'" class="stages-view">
      <div class="stage-list">
        <StageCard
          v-for="(stage, index) in stages"
          :key="index"
          :stage="stage"
          :index="index"
          :totalStages="stages.length"
          @update="updateStage"
          @delete="removeStage"
          @move-up="moveStageUp"
          @move-down="moveStageDown"
        />
      </div>
    </div>

    <div v-else class="text-view">
      <textarea
        v-model="pipelineJson"
        @input="updatePipelineFromJson"
        class="pipeline-textarea"
        :class="{ 'has-errors': hasPipelineErrors }"
        placeholder="Paste your aggregation pipeline JSON here..."
      ></textarea>

      <div v-if="hasPipelineErrors" class="validation-errors">
        <div v-for="error in pipelineValidationErrors" :key="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message">
      <strong>Error:</strong> {{ error }}
    </div>

    <OutputPanel :pipeline="stages" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Pipeline, AggregationStage, ThemeConfig } from '../types'
import StageCard from './StageCard.vue'
import OutputPanel from './OutputPanel.vue'
import { validateAggregationPipeline } from '../validation'

interface Props {
  theme?: ThemeConfig
  initialPipeline?: Pipeline
}

const props = withDefaults(defineProps<Props>(), {
  theme: () => ({})
})

const emit = defineEmits<{
  pipelineChange: [pipeline: Pipeline]
  exportPipeline: [pipeline: Pipeline]
}>()

const stages = ref<Pipeline>(props.initialPipeline || [])
const viewMode = ref<'stages' | 'text'>('stages')
const error = ref<string>('')
const pipelineValidationErrors = ref<string[]>([])
const hasPipelineErrors = computed(() => pipelineValidationErrors.value.length > 0)

const pipelineJson = computed({
  get: () => JSON.stringify(stages.value, null, 2),
  set: (value: string) => {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        stages.value = parsed
        validatePipeline()
      }
    } catch (e) {
      // Invalid JSON, show error
      pipelineValidationErrors.value = ['Invalid JSON syntax']
    }
  }
})

const addStage = () => {
  stages.value.push({ $match: { status: "active" } } as AggregationStage)
  emitPipelineChange()
}

const removeStage = (index: number) => {
  stages.value.splice(index, 1)
  validatePipeline()
  emitPipelineChange()
}

const updateStage = (index: number, stage: AggregationStage) => {
  stages.value[index] = stage
  validatePipeline()
  emitPipelineChange()
}

const moveStageUp = (index: number) => {
  if (index > 0) {
    [stages.value[index - 1], stages.value[index]] = [stages.value[index]!, stages.value[index - 1]!]
    validatePipeline()
    emitPipelineChange()
  }
}

const moveStageDown = (index: number) => {
  if (index < stages.value.length - 1) {
    [stages.value[index], stages.value[index + 1]] = [stages.value[index + 1]!, stages.value[index]!]
    validatePipeline()
    emitPipelineChange()
  }
}

const updatePipelineFromJson = () => {
  validatePipeline()
  emitPipelineChange()
}

const validatePipeline = () => {
  pipelineValidationErrors.value = []
  const validation = validateAggregationPipeline(pipelineJson.value)

  if (!validation.isValid) {
    pipelineValidationErrors.value = validation.errors.map(error => error.message)
  }

  if (validation.warnings.length > 0) {
    validation.warnings.forEach(warning => {
      pipelineValidationErrors.value.push(`Warning: ${warning.message}`)
    })
  }
}

const exportPipeline = () => {
  emit('exportPipeline', stages.value)
}

const emitPipelineChange = () => {
  emit('pipelineChange', stages.value)
}

watch(() => props.theme, (newTheme) => {
  // Apply theme CSS variables
  Object.entries(newTheme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value)
  })
}, { immediate: true })
</script>

<style scoped>
.mongo-aggregation-builder {
  font-family: var(--font-family, var(--v-theme-font), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  color: var(--text-color, var(--v-theme-on-surface));
  background: var(--bg-color, var(--v-theme-surface));
}

.toolbar {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.toolbar button {
  background: var(--button-bg, var(--v-theme-primary));
  color: var(--button-text, var(--v-theme-on-primary));
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.toolbar button:hover {
  background: var(--button-hover-bg, var(--v-theme-primary-variant));
}

.toolbar select {
  padding: 0.5rem;
  border: 1px solid var(--border-color, var(--v-theme-outline));
  border-radius: 4px;
}

.stage-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pipeline-textarea {
  width: 100%;
  height: 400px;
  font-family: var(--mono-font, var(--v-theme-font), monospace);
  padding: 1rem;
  border: 1px solid var(--border-color, var(--v-theme-outline));
  border-radius: 4px;
  background: var(--input-bg, var(--v-theme-surface-variant));
  color: var(--text-color, var(--v-theme-on-surface));
}

.pipeline-textarea.has-errors {
  border-color: var(--error-color, var(--v-theme-error));
}

.validation-errors {
  margin-top: 0.5rem;
}

.error-message {
  color: var(--error-color, var(--v-theme-error));
  background: var(--error-bg, var(--v-theme-error-container));
  border: 1px solid var(--error-border, var(--v-theme-error));
  padding: 0.75rem;
  border-radius: 4px;
  margin: 1rem 0;
}
</style>
