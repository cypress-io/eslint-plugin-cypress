import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/tests/**/*.[jt]s?(x)'],
    globals: true
  },
})
