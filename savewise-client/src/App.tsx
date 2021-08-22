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
import UserAdmin from './components/UserAdmin/UserAdmin';
import SnackbarComponent from './components/Snackbar/SnackbarComponent';
import VaultDashboard from './components/VaultDashboard/VaultDashboard';
import { constants } from './common/objects/constants';

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
            <Route path={constants.routes.login} exact>
              <div className="centered">
                <Login />
              </div>
            </Route>
            <Route path="/user" exact>
                <UserAdmin />
            </Route>
            <PrivateRoute component={UserAdmin} path={constants.routes.account} exact conditionToRender={login.isLogged} />
            <PrivateRoute component={Dashboard} path={constants.routes.dashboard} exact conditionToRender={login.isLogged} />
            <PrivateRoute component={CategoryAdmin} path={constants.routes.categories} exact conditionToRender={login.isLogged} />
            <PrivateRoute component={TransactionAdmin} path={constants.routes.transactions} exact conditionToRender={login.isLogged} />
            <PrivateRoute component={VaultDashboard} path={constants.routes.vaults} exact conditionToRender={login.isLogged} />
            <Redirect from="/" to={constants.routes.login} exact/>
          </Switch>
          <SnackbarComponent />
        </div>
      </Router>
  );
}

export default App;
