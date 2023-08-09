function processJobs() {
  let job
  while ((job = jobs.shift())) {
    /*--add--*/const result = /*--add--*/job()

    // --add--
    Promise.resolve(result).then(
      () => {
        // Job completed successfully
      },
      (error) => {
        console.error(`[scheduler] Error: ${error}`)
      }
    )
    // --add--
  }

  isScheduled = false
}