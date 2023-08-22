let isScheduled = false
const jobs = []

/**
 * Enqueues a job to be run on the next tick.
 * If an update wasn't already scheduled, it will be scheduled now.
 *
 * All the jobs that are added while the update is scheduled will be run on the same tick.
 *
 * @param {Function} job Work to be done
 */
export function enqueueJob(job) {
  jobs.push(job)
  scheduleUpdate()
}

function scheduleUpdate() {
  if (isScheduled) return

  isScheduled = true
  queueMicrotask(processJobs)
}

function processJobs() {
  while (jobs.length > 0) {
    const job = jobs.shift()
    const result = job()

    Promise.resolve(result).then(
      () => {
        // Job completed successfully
      },
      (error) => {
        console.error(`[scheduler]: ${error}`)
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
 * Since it ensures the scheduling happens before the returned promise resolves (either because
 * it was already scheduled or because it is scheduled now), it can be awaited to ensure that
 * the pending jobs have been processed.
 *
 * @returns {Promise<void>} A promise that resolves when all pending jobs have been processed.
 */
export function nextTick() {
  scheduleUpdate()
  return flushPromises()
}

/**
 * Schedules a "macro task" that will resolve a promise after a "micro task" is complete.
 *
 * When you call flushPromises(), the following happens:
 *
 *  1. The `flushPromises()` function is executed.
 *  2. It creates a new promise and schedules a task using `setTimeout()`.
 *  3. The task is placed in the queue and will be executed after all pending microtasks and other tasks in the call stack have run.
 *  4. Once the timeout has elapsed and the macro task is executed, the `resolve()` function is scheduled in the microtask queue.
 *  5. Once it is executed, the promise is fulfilled.
 *
 * The scheduling sequence is as follows:
 *
 *  1. The current call stack is cleared.
 *  2. Micro tasks (such as promise callbacks) in the micro task queue are executed. (There are no micro tasks in this case.)
 *  3. Macro tasks (such as the `setTimeout()` callback) in the macro task queue are executed.
 *
 * This pattern is used to ensure that the promise returned by `flushPromises()` is resolved
 * after any currently pending micro tasks are complete and after any currently executing
 * macro tasks have finished.
 *
 * This can be useful in testing scenarios to ensure that asynchronous operations are fully
 * settled before making assertions or proceeding with further tests.
 *
 * @returns {Promise<void>} A promise that resolves when all pending promises have been processed.
 */
function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve))
}
