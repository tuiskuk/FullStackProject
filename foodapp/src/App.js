import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import SearchBage from './components/SearchPage'
import HomeBage from './components/HomePage'
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
        <Route path="/search" element={<SearchBage />} />
        <Route path="/" element={<HomeBage />} />
        <Route path=':id' element={
          <RecipeViewPage/>
        }/>
      </Routes>
    </Container>
  </Router>
)

export default App
