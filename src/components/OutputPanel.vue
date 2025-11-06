<template>
  <div class="output-panel">
    <div class="output-tabs">
      <button
        :class="{ active: activeTab === 'json' }"
        @click="activeTab = 'json'"
      >
        JSON Pipeline
      </button>
      <button
        :class="{ active: activeTab === 'query' }"
        @click="activeTab = 'query'"
      >
        MongoDB Query
      </button>
    </div>

    <div class="output-content">
      <pre v-if="activeTab === 'json'">{{ pipelineJson }}</pre>
      <pre v-else-if="activeTab === 'query'">{{ mongodbQuery }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Pipeline } from '../types'

interface Props {
  pipeline: Pipeline
}

const props = defineProps<Props>()

const activeTab = ref<'json' | 'query'>('json')

const pipelineJson = computed(() => JSON.stringify(props.pipeline, null, 2))

const mongodbQuery = computed(() => {
  const query = `db.collection.aggregate(${JSON.stringify(props.pipeline, null, 2)})`
  return query
})
</script>

<style scoped>
.output-panel {
  margin-top: 2rem;
  border: 1px solid var(--border-color, var(--v-theme-outline));
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-color, var(--v-theme-surface));
}

.output-tabs {
  display: flex;
  background: var(--input-bg, var(--v-theme-surface-variant));
  border-bottom: 1px solid var(--border-color, var(--v-theme-outline));
}

.output-tabs button {
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  border-right: 1px solid var(--border-color, var(--v-theme-outline));
  color: var(--text-color, var(--v-theme-on-surface));
}

.output-tabs button:last-child {
  border-right: none;
}

.output-tabs button.active {
  background: var(--bg-color, var(--v-theme-surface));
  font-weight: bold;
  color: var(--text-color, var(--v-theme-on-surface));
}

.output-content {
  padding: 1rem;
  background: var(--bg-color, var(--v-theme-surface));
  max-height: 400px;
  overflow-y: auto;
  color: var(--text-color, var(--v-theme-on-surface));
}

.output-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: var(--mono-font, var(--v-theme-font), monospace);
}
</style>
