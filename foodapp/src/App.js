import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import HomePage from './pages/HomePage'
import RecipeViewPage from './pages/RecipeViewPage'
import UserViewPage from './pages/UserViewPage'
import LoginPage from './pages/loginPage'
import { Container } from '@mui/material'
import RegistrationForm from './pages/RegistrationPage'
import UsersPage from './pages/UsersPage'
import UserProfile from './pages/UserProfilePage'
import CreateRecipePage from './pages/createRecipe'
import UserSearchPage from './pages/UserRecipeSearch'
import PersistedLogin from './components/PersistedLogin'
import ErrorLayout from './components/ErrorLayout'
import NavigationBar from './components/NavigationBar'
import Footer from './components/Footer'

const App = () => {
  return (
    <Router>
      <Container>
        <NavigationBar/>
        <ErrorLayout>
          <Routes>
            <Route element={ <PersistedLogin />}>
              <Route path="/userRecipesearch" element={<UserSearchPage/>} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path='/register' element={<RegistrationForm/>}/>
              <Route path='/users' element={<UsersPage/>}/>
              <Route path='/createRecipe' element={<CreateRecipePage/>}/>
              <Route path='/editRecipe' element={<CreateRecipePage/>}/>
              <Route path='/recipes/:recipeId' element={
                <RecipeViewPage/>
              }/>

              <Route path='/users/:id' element={
                <UserViewPage/>
              }/>

              <Route path='/profile' element={<UserProfile/>
              }/>
            </Route>
          </Routes>
        </ErrorLayout>
        <Footer/>
      </Container>
    </Router>)
}

export default App
