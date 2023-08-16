function processJobs() {
  while (jobs.length > 0) {
    const job = jobs.shift()
    /*--add--*/const result = /*--add--*/job() // --1--

    // --add--
    Promise.resolve(result).then( // --2--
      () => { // --3--
        // Job completed successfully
      },
      (error) => {
        console.error(`[scheduler]: ${error}`) // --4--
      }
    )
    // --add--
  }

  isScheduled = false
}