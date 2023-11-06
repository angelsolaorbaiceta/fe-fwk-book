const baseUrl = 'https://gutendex.com/'

// https://gutendex.com/

export async function getAllBooks(page = 1) {
  const res = await fetch(`${baseUrl}/books?page=${page}`)
  return res.json()
}
