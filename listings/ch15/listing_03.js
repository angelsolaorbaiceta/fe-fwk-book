import { vi } from 'vitest'

// Mock the fetch API
global.fetch = vi.fn().mockResolvedValue({
  json: vi.fn().mockResolvedValue([
    'Feed the cat',
    'Mow the lawn',
  ]),
})