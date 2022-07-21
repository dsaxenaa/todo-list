import {useContext, useState} from 'react';

import Pass from './password';
import {Redirect} from "react-router-dom";
import UserContext from "./UserContext";
import axios from 'axios';
import { useHistory } from "react-router-dom";

function Header(){
    const history = useHistory();

  const [email,setEmail] = useState('');



  function changePass(){
    history.push('/changePassword')
  }


  return(
    
    <div>
    <UserContext.Provider value={{email,setEmail}}>

        {/* <a onClick={e => {e.preventDefault();logout();}}>Logout</a> */}
        <a onClick={e => {changePass();}}>Change Password</a>
        </UserContext.Provider>
    </div>

  )  
}

export default Header

