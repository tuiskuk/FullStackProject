import recipeService from '../services/recipes'
import Recipe from './Recipe'
import { useEffect, useState } from 'react'

const SearchBage = () => {
  const [recipes, setRecipes] = useState([])

  useEffect(() => {
    recipeService.getAll().then(response =>
      setRecipes(response.hits.map((hit) => hit.recipe))
    )
  }, [])

  return (
    <div>
      <h2>Showing labels of hardcoded pizza</h2>
      {recipes.map((recipe) => (
        <Recipe
          key={recipe.uri}
          recipe={recipe}
        />
      ))}
    </div>
  )
}

export default SearchBage