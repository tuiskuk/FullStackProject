import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import SearchPage from './components/SearchPage'
import HomePage from './components/HomePage'
import RecipeViewPage from './components/RecipeViewPage'
import { Container, AppBar, Toolbar, Button } from '@mui/material'

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
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/search" element={<SearchPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path=':id' element={
          <RecipeViewPage/>
        }/>
      </Routes>
    </Container>
  </Router>
)

export default App
