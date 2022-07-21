import './register.css';

import {useContext, useState} from 'react';

import {Redirect} from "react-router-dom";
import UserContext from "./UserContext";
import axios from 'axios';
import { useHistory } from "react-router-dom";

function Pass(){
    const history = useHistory();

  const [email,setEmail] = useState('');
  const [newPassword,setNewPassword] = useState('');

  function logout() {
        
    axios.post('http://localhost:4000/logout', {}, {withCredentials:true})
      .then(() => setEmail(''));
       history.push('/login');
    
      
  }

  function ChangePassword(e){
    e.preventDefault();

    const data = {email, newPassword};
    axios.post('http://localhost:4000/reset', data, {withCredentials:true})
      .then(res  => {
        console.log(res);
        window.alert("Password successfully changed!");
        logout();
        
    })
    .catch(e => {
        console.log(e);
        window.alert("error!plz try again");
    })
    ;
   
      
    
  }


    return(
        <div className='message'>
             <UserContext.Provider value={{email,setEmail}}>
                <form onSubmit={e => ChangePassword(e)}>
                <div >
      <div className="card-image"/>	
		
    
<div className="field">
    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={email} />
    <label>Email</label>
  </div>
  

  <div className="field">
    <input type="password"  value={newPassword} onChange={e => setNewPassword(e.target.value)}  />
    <label>New Password</label>
  </div>
  </div>
  <br/>
  <button type="submit">Change</button>
               
                </form>
             </UserContext.Provider>
            
        </div>
    )
}

export default Pass;