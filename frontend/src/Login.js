import {useContext, useState} from 'react';

import {Redirect} from "react-router-dom";
import UserContext from "./UserContext";
import axios from 'axios';

function Login() {

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [loginError,setLoginError] = useState(false);
  const [redirect,setRedirect] = useState(false);

  const user = useContext(UserContext);

  function loginUser(e) {
    e.preventDefault();

    const data = {email,password};
    axios.post('http://localhost:4000/login', data, {withCredentials:true})
      .then(response => {
        user.setEmail(response.data.email);
        setEmail('');
        setPassword('');
        setLoginError(false);
        setRedirect(true);
      })
      .catch(() => {
        setLoginError(true);
      });
  }

  if (redirect) {
    return <Redirect to={'/'} />
  }

  return (
    <div className='message'>
    <form action="" onSubmit={e => loginUser(e)}>
      <div>
      <div className="card-image"/>	
      {loginError && (
        <div>Wrong email or password!</div>
      )}
      
      <div className="field">
    <input type="email" placeholder='email' value={email} onChange={e => setEmail(e.target.value)}  />
    <label className='labell'>Email</label>
  </div>

  <div className="field">
    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
    <label className='labell'>Password</label>
  </div>
      </div>
      <br/>
      <button type="submit">Log IN</button>
    </form>
    </div>
  );
}

export default Login;