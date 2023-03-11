function hasOppositeMove(sequence, from, to) {
  return sequence.some(
    ({ op, from: _from, index: _to }) =>
      op === ARRAY_DIFF_OP.MOVE && _from === to && _to === from
  )
}