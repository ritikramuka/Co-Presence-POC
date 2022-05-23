import React from 'react'
import { Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import FluidPages from './Pages/FluidPages'
import Home from './Pages/Home'
import { PATH } from './config'

const App = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path={`/${PATH}/:id`}>
          <FluidPages></FluidPages>
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

export default App