import { useEffect, useState, useReducer } from 'react'
import Gun from 'gun'
import { BrowserRouter as Router } from 'react-router-dom'
import {faker} from '@faker-js/faker'
import './App.css'
import Login from './Login'
import SignUp from './signup'
import { useNavigate, Routes, Route, BrowserRouter, Link, Switch} from 'react-router-dom';
import Dashboard from './Dashboard'


//were using port 5050
const gun = Gun({
  peers: [
    'http://localhost:5050/gun'
  ]
})

const currentState = {
  messages: []
}

const reducer = (state, message) => {
  return {
    messages: [message, ...state.messages]
  }
}

function MyCustomButton({ children }) {
  return <button>{children}</button>;
}

function App() {
  const [messageText, setMessageText] = useState('') //setters for initialization
  const [state, dispatch] = useReducer(reducer, currentState) //more setters
  const [loggedInUser, setLoggedInUser] = useState(null);
  
  /*
  useEffect is loaded with the page, il change this shit to be less
  horribe l8r
  */
  useEffect(() => { //load the page
    const getMessages = gun.get('MESSAGES')
    //calls dispatch function for every message to get some cool data
    getMessages.map().on(m => {
      dispatch({
        name: m.name,
        avi: m.avatar,
        content: m.content,
        timestamp: m.timestamp
      })
    })
  }, [])

  const sendMessage = () => { 
    const refMessages = gun.get('MESSAGES')

    const msgObj = {
      name: loggedInUser,
      avi: faker.image.avatar(),
      content: messageText,
      timestamp: Date().substring(16, 21) //Date includes some worthless info, il play around w this tmrw
    }
    refMessages.set(msgObj)

    setMessageText('')
  }
  
  // remove duplicate messages
  const newMessagesArray = () => {
    const formattedMessages = state.messages.filter((value, index) => {
      const _val = JSON.stringify(value)
      return (
        index ===
        state.messages.findIndex(obj => {
          return JSON.stringify(obj) === _val
        })
      )
    })

    return formattedMessages
  }
  


return (
  
  <div className="App">
    {loggedInUser ? (
      <Dashboard loggedInUser={loggedInUser} />
    ):
    <main>
      <div class = "navtop">
    <header>
      <BrowserRouter>
        <Routes>
          <Route exact path='/signup' element={<SignUp />} />
        </Routes>
        <Routes>
          <Route exact path='/Login' element={<Login />} />
        </Routes>
        <Routes>
          <Route exact path='/' element={<className />} />
        </Routes>
        <nav>
          <Link to="/">
            <MyCustomButton>Chat</MyCustomButton>
          </Link>
          <Link to="/signup">
            <MyCustomButton>Sign Up</MyCustomButton>
          </Link>
          <Link to="/Login">
            <MyCustomButton>
              Login
              </MyCustomButton>
          </Link>
        </nav>
      </BrowserRouter>
    </header>

    </div>
      <div className='messages'>
        <ul>
          {newMessagesArray().map((msg, index) => [
            <li key={index} className='message'>
              <img alt='avatar' src={'https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg'} />
              <div>
                {msg.content}
                <span>{msg.name}, {msg.timestamp}</span>
              </div>
            </li>
          ])}
        </ul>
      </div>
      <div className='input-box'>
      <input placeholder='Type a message...' onChange={e => setMessageText(e.target.value)} value={messageText} onKeyDown={(e) => {
          if (e.key === 'Enter') sendMessage()
        }}/>
        <button onClick={sendMessage}>Send</button>
      </div>
    </main>
    }</div>
)}

export default App