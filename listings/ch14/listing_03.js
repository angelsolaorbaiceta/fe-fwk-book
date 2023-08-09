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
    job()
  }

  isScheduled = false
}