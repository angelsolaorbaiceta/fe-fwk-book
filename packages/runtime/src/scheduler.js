let isRunning = false
const jobs = []

const promise = Promise.resolve()

export function enqueueJob(job) {
  jobs.push(job)
  scheduleUpdate()
}

function scheduleUpdate() {
  if (isRunning) return

  isRunning = true
  promise.then(processJobs)
}

function processJobs() {
  isRunning = true

  let job
  while ((job = jobs.shift())) {
    Promise.resolve(job()).then(
      () => {
        // Job completed successfully
      },
      (error) => {
        console.error(`[scheduler] Error: ${error}`)
      }
    )
  }

  isRunning = false
}

/**
 * Returns a promise that resolves once all pending jobs have been processed.
 *
 * @returns {Promise<void>} A promise that resolves when all pending jobs have been processed.
 */
export function nextTick() {
  scheduleUpdate()
  console.log('nextTick')
  return promise
}
