import './register.css';

import {useContext, useState} from 'react';

import {Redirect} from "react-router-dom";
import UserContext from "./UserContext";
import axios from 'axios';

function Register() {

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const[userName,setuserName] = useState('');
  const [redirect,setRedirect] = useState(false);

  const user = useContext(UserContext);

  function registerUser(e) {
    e.preventDefault();

    const data = {email,password};
    axios.post('http://localhost:4000/register', data, {withCredentials:true})
      .then(response => {
        user.setEmail(response.data.email);
        setEmail('');
        setuserName('');
        setPassword('');
        setRedirect(true);
      });
  }

  if (redirect) {
    return <Redirect to={'/'} />
  }

  return (
    <div className='message'>

    
    <form action="" onSubmit={e => registerUser(e)}>
      <div >
      <div className="card-image"/>	
		
    
<div className="field">
    <input type="email" placeholder='email' value={email} onChange={e => setEmail(e.target.value)} required />
    <label>Email</label>
  </div>
  <div className="field">
    <input type="text"  value={userName} onChange={e => setuserName(e.target.value)} required />
    <label>User Name</label>
  </div>

  <div className="field">
    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
    <label>Password</label>
  </div>
  </div>
  <br/>
  <button type="submit">register</button>
    </form>
    </div>
  );
}

export default Register;