const baseUrl = 'https://gutendex.com/'

// https://gutendex.com/

export async function getAllBooks(page = 1, filters = {}) {
  const searchParams = new URLSearchParams({ page })

  if (filters.languages && filters.languages.length > 0) {
    searchParams.set('languages', filters.languages)
  }

  const res = await fetch(`${baseUrl}/books?${searchParams}`)
  return res.json()
}
