<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <h1 class="nav-title">Mongo Aggregation Builder</h1>
        <div class="nav-links">
          <a href="../index.html">Home</a>
          <a href="#demo">Demo</a>
          <a href="#api">API</a>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <section id="demo" class="demo-section">
        <div class="container">
          <h2>Interactive Demo</h2>
          <p>Try building an aggregation pipeline below. The component will generate JSON and MongoDB query outputs in real-time.</p>

          <div class="demo-controls">
            <div class="control-group">
              <label for="connection-toggle">Enable MongoDB Connection:</label>
              <input id="connection-toggle" v-model="enableConnection" type="checkbox">
            </div>

            <div v-if="enableConnection" class="connection-config">
              <div class="control-group">
                <label for="uri">MongoDB URI:</label>
                <input id="uri" v-model="connection.uri" type="text" placeholder="mongodb://localhost:27017">
              </div>
              <div class="control-group">
                <label for="database">Database:</label>
                <input id="database" v-model="connection.database" type="text" placeholder="myapp">
              </div>
              <div class="control-group">
                <label for="collection">Collection:</label>
                <input id="collection" v-model="connection.collection" type="text" placeholder="users">
              </div>
            </div>

            <div class="theme-selector">
              <label>Theme:</label>
              <select v-model="selectedTheme">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="blue">Blue</option>
              </select>
            </div>
          </div>

          <div class="demo-builder">
            <MongoAggregationBuilder
              :connection="enableConnection ? connection : undefined"
              :theme="currentTheme"
            />
          </div>
        </div>
      </section>

      <section id="api" class="api-section">
        <div class="container">
          <h2>API Documentation</h2>

          <div class="api-item">
            <h3>Props</h3>
            <table class="api-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>connection</code></td>
                  <td><code>ConnectionConfig</code></td>
                  <td><code>undefined</code></td>
                  <td>MongoDB connection details for running pipelines</td>
                </tr>
                <tr>
                  <td><code>theme</code></td>
                  <td><code>ThemeConfig</code></td>
                  <td><code>{}</code></td>
                  <td>CSS variables for theming</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="api-item">
            <h3>ConnectionConfig</h3>
            <pre class="code-block">interface ConnectionConfig {
  uri: string      // MongoDB connection URI
  database: string // Database name
  collection: string // Collection name
}</pre>
          </div>

          <div class="api-item">
            <h3>Supported Stages</h3>
            <div class="stage-grid">
              <div class="stage-item" v-for="stage in allStages" :key="stage">
                <code>{{ stage }}</code>
              </div>
            </div>
          </div>

          <div class="api-item">
            <h3>Installation</h3>
            <pre class="code-block">npm install @rakmaster/mongo-aggregation-builder</pre>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MongoAggregationBuilder from '../../src/components/MongoAggregationBuilder.vue'

const enableConnection = ref(false)
const connection = ref({
  uri: 'mongodb://localhost:27017',
  database: 'myapp',
  collection: 'users'
})

const selectedTheme = ref('light')

const themes = {
  light: {
    'bg-color': '#ffffff',
    'text-color': '#333333',
    'button-bg': '#667eea',
    'button-hover-bg': '#5a67d8',
    'border-color': '#e2e8f0',
    'input-bg': '#ffffff',
    'error-color': '#e53e3e',
    'error-bg': '#fed7d7',
    'error-border': '#feb2b2'
  },
  dark: {
    'bg-color': '#1a202c',
    'text-color': '#f7fafc',
    'button-bg': '#667eea',
    'button-hover-bg': '#5a67d8',
    'border-color': '#4a5568',
    'input-bg': '#2d3748',
    'error-color': '#fc8181',
    'error-bg': '#742a2a',
    'error-border': '#9b2c2c'
  },
  blue: {
    'bg-color': '#ebf8ff',
    'text-color': '#2a4365',
    'button-bg': '#3182ce',
    'button-hover-bg': '#2c5282',
    'border-color': '#90cdf4',
    'input-bg': '#ffffff',
    'error-color': '#e53e3e',
    'error-bg': '#fed7d7',
    'error-border': '#feb2b2'
  }
}

const currentTheme = computed(() => themes[selectedTheme.value])

const allStages = [
  '$addFields', '$bucket', '$bucketAuto', '$changeStream', '$changeStreamSplitLargeEvent',
  '$collStats', '$count', '$currentOp', '$densify', '$documents', '$facet', '$fill',
  '$geoNear', '$graphLookup', '$group', '$indexStats', '$limit', '$listLocalSessions',
  '$listSessions', '$lookup', '$match', '$merge', '$out', '$planCacheStats', '$project',
  '$redact', '$replaceRoot', '$replaceWith', '$sample', '$search', '$searchMeta', '$set',
  '$setWindowFields', '$shardedDataDistribution', '$skip', '$sort', '$sortByCount',
  '$unionWith', '$unset', '$unwind'
]
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;
  color: #333;
  background: #fafafa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.navbar {
  background: #667eea;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-title {
  font-size: 1.5rem;
  font-weight: 500;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 400;
}

.nav-links a:hover {
  text-decoration: underline;
}

.main-content {
  min-height: calc(100vh - 80px);
}

.demo-section, .api-section {
  padding: 60px 0;
}

.demo-section {
  background: #f8f9fa;
}

.api-section {
  background: white;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.demo-controls {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin: 2rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.control-group {
  margin-bottom: 1rem;
}

.control-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.control-group input, .control-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.connection-config {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.theme-selector {
  margin-top: 1rem;
}

.demo-builder {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.api-item {
  margin-bottom: 3rem;
}

.api-item h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.api-table th, .api-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.api-table th {
  background: #f8f9fa;
  font-weight: 600;
}

.api-table code {
  background: #f1f3f4;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Monaco', monospace;
}

.code-block {
  background: #2d3748;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Monaco', monospace;
  font-size: 0.9rem;
  line-height: 1.4;
}

.stage-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.stage-list li {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #667eea;
}

.stage-list code {
  background: #e2e8f0;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-weight: 600;
}

.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
}

.stage-item {
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.stage-item code {
  font-size: 0.9rem;
  font-weight: 500;
  color: #2d3748;
}
</style>
