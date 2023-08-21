afterEach(/*--add--*/async /*--add--*/() => {
  // --add--
  await nextTick() // --1--
  // --add--
  app.unmount()
})