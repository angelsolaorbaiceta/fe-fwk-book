const url = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'

export async function fetchRandomCocktail() {
  const response = await fetch(url)
  const data = await response.json()

  return data.drinks[0]
}
