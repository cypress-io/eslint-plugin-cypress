import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/tests/**/*.[jt]s?(x)'],
    isolate: false,
    slowTestThreshold: 600,
    globals: true
  },
})
