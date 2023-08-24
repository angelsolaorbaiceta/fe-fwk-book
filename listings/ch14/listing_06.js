test('Shows the list of todos after the data is fetched', async () => {
  // The `nextTick()` function is awaited for, so the onMounted() hooks
  // finished running and the list of todos is displayed.

  await nextTick() // --1--

  expect(document.body.innerHTML).toContain('Feed the cat')
  expect(document.body.innerHTML).toContain('Mow the lawn')
})