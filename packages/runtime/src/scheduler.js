let isScheduled = false
const jobs = []
const promise = Promise.resolve()

export function enqueueJob(job) {
  jobs.push(job)
  scheduleUpdate()
}

function scheduleUpdate() {
  if (isScheduled) return

  isScheduled = true
  promise.then(processJobs)
}

function processJobs() {
  let job
  while ((job = jobs.shift())) {
    const result = job()

    Promise.resolve(result).then(
      () => {
        // Job completed successfully
      },
      (error) => {
        console.error(`[scheduler] Error: ${error}`)
      }
    )
  }

  isScheduled = false
}

/**
 * Returns a promise that resolves once all pending jobs have been processed.
 * If the jobs are asynchronous, the promise will resolve before all the jobs have completed.
 * To account for this asynchronous behavior, you can use `await nextTick()` in an async function.
 *
 * @returns {Promise<void>} A promise that resolves when all pending jobs have been processed.
 */
export function nextTick() {
  scheduleUpdate()
  return promise
}

export function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve))
}
