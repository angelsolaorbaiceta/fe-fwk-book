test('Shows the loading indicator while the todos are fetched', () => {
  // If nextTick() isn't awaited for, the onMounted() hooks haven't run yet
  // so the loading should be displayed.

  expect(document.body.innerHTML).toContain('Loading...')
})