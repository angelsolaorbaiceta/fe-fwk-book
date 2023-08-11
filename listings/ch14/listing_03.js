let isScheduled = false
const jobs = []

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
  let job
  while ((job = jobs.shift())) {
    job()
  }

  isScheduled = false
}