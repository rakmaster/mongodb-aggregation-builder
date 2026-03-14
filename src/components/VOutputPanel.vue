<template>
  <v-row>
    <v-col>
    <v-card>
      <v-card-title class="d-flex align-center">
        <span>Output</span>
        <v-spacer />
        <v-btn @click="$emit('export')" size="small">
          Export
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-tabs v-model="activeTab" color="primary">
          <v-tab value="json">JSON</v-tab>
          <v-tab value="query">Query</v-tab>
        </v-tabs>

        <v-window v-model="activeTab" class="mt-4 output-window">
          <v-window-item value="json">
            <pre class="output-pre">{{ pipelineJson }}</pre>
          </v-window-item>

          <v-window-item value="query">
              <pre class="output-pre">{{ mongodbQuery }}</pre>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { VRow, VCol, VCard, VCardTitle, VCardText, VSpacer, VBtn, VTabs, VTab, VWindow, VWindowItem } from 'vuetify/components'
import type { Pipeline } from '../types'

interface Props {
  pipeline: Pipeline
}

const props = defineProps<Props>()

const emit = defineEmits<{
  export: []
}>()

const activeTab = ref<'json' | 'query'>('json')

const pipelineJson = computed(() => JSON.stringify(props.pipeline, null, 2))

const mongodbQuery = computed(() => {
  const query = `db.collection.aggregate(${JSON.stringify(props.pipeline, null, 2)})`
  return query
})
</script>

<style scoped>
.output-window {
  max-height: 600px;
  overflow-y: auto;
}

.output-pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 550px;
  overflow-y: auto;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.v-theme--dark .output-pre {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
