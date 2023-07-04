import Recipe from './Recipe'
import { TextField, Button, CircularProgress } from '@mui/material'
import { useState, useEffect } from 'react'
import { useGetAllRecipesQuery, useGetNextPageQuery } from '../services/apiSlice'

//when swiching page localStorage.clear();

const SearchBage = () => {
  const [recipes, setRecipes] = useState([])
  const [search, setSearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [nextPageLink, setNextPageLink] = useState('')
  const { data: allRecipesData, isLoading } = useGetAllRecipesQuery(searchTerm)
  const { data: NextPageData } = useGetNextPageQuery(nextPageLink)






  useEffect(() => {
    setSearchTerm(searchTerm || localStorage.getItem('search') || 'recommended')
  }, [])


  useEffect(() => {
    console.log(allRecipesData)
    if (allRecipesData) {
      setRecipes(allRecipesData.hits.map((hit) => hit.recipe))
      if(allRecipesData._links.next && allRecipesData._links.next.href ) setNextPageLink(allRecipesData._links.next.href)

    }
    setSearch('')



  }, [allRecipesData])





  const handleClickSearch = async () => {
    setSearchTerm(search)


  }

  const fetchNextPage = async () => {
    if (nextPageLink) {

      setRecipes((prevRecipes) => [...prevRecipes, ...NextPageData.hits.map((hit) => hit.recipe)])
      if (NextPageData._links.next && NextPageData._links.next.href) {
        setNextPageLink(NextPageData._links.next.href)
      } else {
        setNextPageLink('')
      }
    }
  }

  const goToNextPage = () => {
    if (nextPageLink) {
      fetchNextPage()
    }
  }

  return (
    <div>
      <TextField
        label="Search recipes"
        value={search}
        onChange={(e) => {
          console.log(e.target.value)
          setSearch(e.target.value)}}
      />
      <Button variant="contained" onClick={handleClickSearch}>
        Search
      </Button>
      <h2>Check recommended recipes or feel free to search recipes yourself</h2>
      {isLoading ? (
        <CircularProgress /> // Render the loading spinner when loading is true
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          {recipes.map((recipe) => (
            <Recipe key={recipe.uri} recipe={recipe} />
          ))}
        </div>
      )}
      {nextPageLink && (
        <Button variant="outlined" onClick={goToNextPage}>
          Load more
        </Button>
      )}
    </div>
  )
}

export default SearchBage