const url = 'https://api.coincap.io/v2'

export async function fetchAssets(limit = 10, offset = 0) {
  const res = await fetch(`${url}/assets?limit=${limit}&offset=${offset}`)
  const { data } = await res.json()

  return data
}

export async function fetchRates(id) {
  const res = await fetch(`${url}/rates/${id}`)
  const { data } = await res.json()

  return data
}
