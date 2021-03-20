import React, { useContext, useEffect } from 'react';
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
import { SessionService } from './services';
import { User } from './common/objects/user';
import TransactionAdmin from './components/TransactionAdmin/TransactionAdmin';

function App() {
  const {login, setLogin} = useContext(LoginContext);
  useEffect(() => {
    const user: User | null = SessionService.getLogin();
    if (user) {
      setLogin({ isLogged: true, login: user });
    }
    return () => {
      
    }
  }, [setLogin])

  return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/login" exact>
              <div className="centered">
                <Login />
              </div>
            </Route>
            <PrivateRoute component={Dashboard} path="/dashboard" exact conditionToRender={login.isLogged} />
            <PrivateRoute component={CategoryAdmin} path="/categories" exact conditionToRender={login.isLogged} />
            <PrivateRoute component={TransactionAdmin} path="/transactions" exact conditionToRender={login.isLogged} />
            <Redirect from="/" to="/login" exact/>
          </Switch>
        </div>
      </Router>
  );
}

export default App;
