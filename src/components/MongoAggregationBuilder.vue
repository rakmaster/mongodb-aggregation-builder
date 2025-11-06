<template>
  <div class="mongo-aggregation-builder">
    <div class="toolbar">
      <button @click="addStage">Add Stage</button>
      <button @click="runPipeline" v-if="hasConnection">Run Pipeline</button>
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

    <OutputPanel :pipeline="stages" :results="results" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Pipeline, AggregationStage, ConnectionConfig, ThemeConfig } from '../types'
import StageCard from './StageCard.vue'
import OutputPanel from './OutputPanel.vue'
import { validateAggregationPipeline } from '../validation'

interface Props {
  connection?: ConnectionConfig
  theme?: ThemeConfig
}

const props = withDefaults(defineProps<Props>(), {
  connection: undefined,
  theme: () => ({})
})

const stages = ref<Pipeline>([])
const results = ref<any[]>([])
const viewMode = ref<'stages' | 'text'>('stages')
const error = ref<string>('')
const pipelineValidationErrors = ref<string[]>([])
const hasPipelineErrors = computed(() => pipelineValidationErrors.value.length > 0)

const hasConnection = computed(() => !!props.connection)

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
}

const removeStage = (index: number) => {
  stages.value.splice(index, 1)
  validatePipeline()
}

const updateStage = (index: number, stage: AggregationStage) => {
  stages.value[index] = stage
  validatePipeline()
}

const moveStageUp = (index: number) => {
  if (index > 0) {
    [stages.value[index - 1], stages.value[index]] = [stages.value[index]!, stages.value[index - 1]!]
    validatePipeline()
  }
}

const moveStageDown = (index: number) => {
  if (index < stages.value.length - 1) {
    [stages.value[index], stages.value[index + 1]] = [stages.value[index + 1]!, stages.value[index]!]
    validatePipeline()
  }
}

const updatePipelineFromJson = () => {
  validatePipeline()
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

const runPipeline = async () => {
  if (!props.connection) return

  error.value = ''
  pipelineValidationErrors.value = []

  // Validate pipeline before running
  const validation = validateAggregationPipeline(pipelineJson.value)
  if (!validation.isValid) {
    pipelineValidationErrors.value = validation.errors.map(error => error.message)
    return
  }

  try {
    const { MongoClient } = await import('mongodb')
    const client = new MongoClient(props.connection.uri)
    await client.connect()

    const db = client.db(props.connection.database)
    const collection = db.collection(props.connection.collection)

    const pipelineResult = await collection.aggregate(stages.value).toArray()
    results.value = pipelineResult

    await client.close()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error running pipeline:', err)
  }
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
  font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  color: var(--text-color, #333);
  background: var(--bg-color, #fff);
}

.toolbar {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.toolbar button {
  background: var(--button-bg, #007bff);
  color: var(--button-text, white);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.toolbar button:hover {
  background: var(--button-hover-bg, #0056b3);
}

.toolbar select {
  padding: 0.5rem;
  border: 1px solid var(--border-color, #ccc);
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
  font-family: var(--mono-font, monospace);
  padding: 1rem;
  border: 1px solid var(--border-color, #ccc);
  border-radius: 4px;
  background: var(--input-bg, white);
  color: var(--text-color, #333);
}

.pipeline-textarea.has-errors {
  border-color: #dc3545;
}

.validation-errors {
  margin-top: 0.5rem;
}

.error-message {
  color: var(--error-color, #dc3545);
  background: var(--error-bg, #f8d7da);
  border: 1px solid var(--error-border, #f5c6cb);
  padding: 0.75rem;
  border-radius: 4px;
  margin: 1rem 0;
}
</style>
