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
      <button
        :class="{ active: activeTab === 'results' }"
        @click="activeTab = 'results'"
        v-if="results.length > 0"
      >
        Results ({{ results.length }})
      </button>
    </div>

    <div class="output-content">
      <pre v-if="activeTab === 'json'">{{ pipelineJson }}</pre>
      <pre v-else-if="activeTab === 'query'">{{ mongodbQuery }}</pre>
      <div v-else-if="activeTab === 'results'" class="results-preview">
        <pre v-for="(doc, idx) in results.slice(0, 10)" :key="idx">{{ JSON.stringify(doc, null, 2) }}</pre>
        <p v-if="results.length > 10">... and {{ results.length - 10 }} more documents</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Pipeline } from '../types'

interface Props {
  pipeline: Pipeline
  results: any[]
}

const props = defineProps<Props>()

const activeTab = ref<'json' | 'query' | 'results'>('json')

const pipelineJson = computed(() => JSON.stringify(props.pipeline, null, 2))

const mongodbQuery = computed(() => {
  const query = `db.collection.aggregate(${JSON.stringify(props.pipeline, null, 2)})`
  return query
})
</script>

<style scoped>
.output-panel {
  margin-top: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.output-tabs {
  display: flex;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.output-tabs button {
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  border-right: 1px solid #ddd;
}

.output-tabs button:last-child {
  border-right: none;
}

.output-tabs button.active {
  background: white;
  font-weight: bold;
}

.output-content {
  padding: 1rem;
  background: white;
  max-height: 400px;
  overflow-y: auto;
}

.output-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.results-preview pre {
  background: #f9f9f9;
  padding: 0.5rem;
  margin: 0.25rem 0;
  border-radius: 4px;
  font-size: 0.8rem;
}
</style>
