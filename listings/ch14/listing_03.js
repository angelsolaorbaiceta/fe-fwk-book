let isScheduled = false // --1--
const jobs = [] // --2--

export function enqueueJob(job) {
  jobs.push(job) // --3--
  scheduleUpdate() // --4--
}

function scheduleUpdate() {
  if (isScheduled) return

  isScheduled = true
  queueMicrotask(processJobs) // --5--
}

function processJobs() {
  while (jobs.length > 0) { // --6--
    const job = jobs.shift()
    job()
  }

  isScheduled = false // --7--
}