import './App.css';

import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import {useEffect, useState} from 'react';

import Header from './resetpass';
import Home from "./Home";
import Login from "./Login";
import Pass from './password';
import Register from "./Register";
import UserContext from "./UserContext";
import axios from "axios";

function App() {
  const [email,setEmail] = useState('');

  useEffect(() => {
    axios.get('http://localhost:4000/user', {withCredentials:true})
      .then(response => {
        setEmail(response.data.email);
      });
  }, []);

  function logout() {
    axios.post('http://localhost:4000/logout', {}, {withCredentials:true})
      .then(() => setEmail(''));
  }

  return (
     <div className='bg'>
    <UserContext.Provider value={{email,setEmail}}>
      <BrowserRouter>
        <nav className="customize-navbar fixed-top w-100">
          <Link to={'/'}>Home</Link>
          {!email && (
            <>
              <Link to={'/login'}>Login</Link>
              <Link to={'/register'}>Register</Link>
            </>
          )}
          {!!email && (
            <div>
            <a onClick={e => {e.preventDefault();logout();}}>Logout</a>
            <Header/>
            </div>
          )
          
          
          
          }
        </nav>
        <main>
          <Switch>
            <Route exact path={'/'} component={Home} />
            <Route exact path={'/register'} component={Register} />
            <Route exact path={'/login'} component={Login} />
            <Route exact path={'/changePassword'} component={Pass} />
          </Switch>
        </main>
      </BrowserRouter>
    </UserContext.Provider>
    </div>
  );
}

export default App;
