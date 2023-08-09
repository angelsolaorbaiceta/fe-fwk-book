let isRunning = false
const jobs = []

const nextTick = Promise.resolve()

export function enqueueJob(job) {
  jobs.push(job)
  scheduleUpdate()
}

function scheduleUpdate() {
  if (isRunning) return

  isRunning = true
  nextTick.then(processJobs)
}

function processJobs() {
  isRunning = true

  let job
  while ((job = jobs.shift())) {
    Promise.resolve(job()).then(
      () => {},
      (error) => {
        console.error(`[scheduler] Error: ${error}`)
      }
    )
  }

  isRunning = false
}
