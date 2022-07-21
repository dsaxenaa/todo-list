import './home.css';

import {useContext, useEffect, useState} from "react";

import UserContext from "./UserContext";
import axios from "axios";

function Home() {
  
  const userInfo = useContext(UserContext);
  const [inputVal, setInputVal] = useState('');
  const [todos,setTodos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/todos', {withCredentials:true})
      .then(response => {
        setTodos(response.data);
      })
  }, []);

  if (!userInfo.email) {
    
    return (
      <div className='message'>
      Login or Register to use to the To-Do App
      </div>
      

    
    )
    
    
  }

  function addTodo(e) {
    e.preventDefault();
    axios.put('http://localhost:4000/todos', {text:inputVal}, {withCredentials:true})
      .then(response => {
        setTodos([...todos, response.data]);
        setInputVal('');
      })

  }

  function updateTodo(todo) {
    const data = {id:todo._id,done:!todo.done};
    axios.post('http://localhost:4000/todos', data, {withCredentials:true})
      .then(() => {
        const newTodos = todos.map(t => {
          if (t._id === todo._id) {
            t.done = !t.done;
          }
          return t;
        });
        setTodos([...newTodos]);
      });
  }

  return <div className='message'>
    <div className='cardd'/>
    <form onSubmit={e => addTodo(e)}>
      <h3>what do you wanna do? {userInfo.userName} </h3>
      <input placeholder={'What do you want to do?'}
             value={inputVal}
             onChange={e => setInputVal(e.target.value)}/>
    </form>
    <ul>
      {todos.map(todo => (
        <li>
          <input type={'checkbox'}
                 checked={todo.done}
                 onChange={() => updateTodo(todo)}
          />
          {todo.done ? <del>{todo.text}</del> : todo.text}
        </li>
      ))}

    </ul>
  </div>
}

export default Home;