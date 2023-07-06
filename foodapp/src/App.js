import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import SearchPage from './components/SearchPage'
import HomePage from './components/HomePage'
import RecipeViewPage from './components/RecipeViewPage'
import UserViewPage from './components/UserViewPage'
import { Container, AppBar, Toolbar, Button } from '@mui/material'
import RegistrationForm from './components/RegistrationPage'
import UsersPage from './components/UsersPage'

const App = () => (
  <Router>
    <Container>
      <AppBar position="static">
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
          <Button color="inherit" component={Link} to="/register">
            register
          </Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/search" element={<SearchPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path='/register' element={<RegistrationForm/>}/>
        <Route path='/users' element={<UsersPage/>}/>
        <Route path='/recipes/:id' element={
          <RecipeViewPage/>
        }/>
        <Route path='/users/:id' element={
          <UserViewPage/>
        }/>
      </Routes>
    </Container>
  </Router>
)

export default App
