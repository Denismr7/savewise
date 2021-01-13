import React, { useContext } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import './App.css';
import Login from './components/Login/Login';
import 'fontsource-roboto';
import { CategoryAdmin } from './components';
import PrivateRoute from './common/wrappers/PrivateRoute';
import { LoginContext } from './common/context/LoginContext';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const {login} = useContext(LoginContext);
  return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/login" exact>
              <div className="centered">
                <Login />
              </div>
            </Route>
            <Route path="/dashboard" exact>
              <div style={{ marginTop: '5%' }}>
                <Dashboard />
              </div>
            </Route>
            <PrivateRoute component={CategoryAdmin} path="/categories" exact conditionToRender={login.isLogged} />
            <Redirect from="/" to="/login" exact/>
          </Switch>
        </div>
      </Router>
  );
}

export default App;
