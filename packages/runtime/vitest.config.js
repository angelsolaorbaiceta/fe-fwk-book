import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/__tests__/**/*.test.js'],
    reporters: 'verbose',
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
    },
  },
})
