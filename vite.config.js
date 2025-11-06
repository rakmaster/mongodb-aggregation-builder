import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MongoAggregationBuilder',
      formats: ['es', 'umd'],
      fileName: (format) => `mongo-aggregation-builder.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'mongodb'],
      output: {
        globals: {
          vue: 'Vue',
          mongodb: 'mongodb'
        }
      }
    }
  }
})
