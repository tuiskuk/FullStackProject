import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import SearchPage from './components/SearchPage'
import HomePage from './components/HomePage'
import RecipeViewPage from './components/RecipeViewPage'
import UserViewPage from './components/UserViewPage'
import LoginPage from './components/loginPage'
import { AppBar, Toolbar, Button } from '@mui/material'
import RegistrationForm from './components/RegistrationPage'
import UsersPage from './components/UsersPage'
import UserProfile from './components/UserProfilePage'
import CreateRecipePage from './components/createRecipe'
import UserSearchPage from './components/UserRecipeSearch'
import UserRecipeViewPage from './components/UserRecipeViewPage'
//import RequireLogin from './components/RequireLogin'
import PersistedLogin from './components/PersistedLogin'
import { selectCurrentUser } from './services/loginSlice'
import { useSelector } from 'react-redux'

const App = () => {
  const user = useSelector(selectCurrentUser)
  return (
    <Router>

      <AppBar position="relative">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
              home
          </Button>
          <Button color="inherit" component={Link} to="/search">
              search
          </Button>
          <Button color="inherit" component={Link} to="/users">
              Discover users
            </Button>
            <Button color="inherit" component={Link} to="/userRecipesearch">
              recipes by other users
            </Button>
            {user && (
              <Button color="inherit" component={Link} to="/profile">
                  My Profile
            </Button>
          )}
          {user && (
            <Button color="inherit" component={Link} to="/createrecipe">
                  Create recipe
            </Button>
          )}
          <Button color="inherit" component={Link} to="/login">
              login
          </Button>
        </Toolbar>
      </AppBar>

      <Routes>


          <Route element={ <PersistedLogin />}>
            <Route path="/userRecipesearch" element={<UserSearchPage/>} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/register' element={<RegistrationForm/>}/>
            <Route path='/users' element={<UsersPage/>}/>
            <Route path='/createrecipe' element={<CreateRecipePage/>}/>
            <Route path='/recipes/:recipeId' element={
              <RecipeViewPage/>
            }/>
            <Route path='/userRecipes/:recipeId' element={
              <UserRecipeViewPage/>
            }/>
            <Route path='/users/:id' element={
              <UserViewPage/>
            }/>

          <Route path='/profile' element={<UserProfile/>
          }/>
        </Route>
      </Routes>
    </Router>)
}

export default App
