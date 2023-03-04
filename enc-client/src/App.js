import { useEffect, useState, useReducer } from 'react'
import Gun from 'gun'
import {faker} from '@faker-js/faker'
import './App.css'



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

function App() {
  const [messageText, setMessageText] = useState('') //setters for initialization
  const [state, dispatch] = useReducer(reducer, currentState) //more setters


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
      name: faker.name.firstName(),
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

return <div className="App">
    <main>
      <div class = "navtop">
    <header>
    <a class="cta" href = "#"><button class = "login">Login</button></a>
    <a class="cta" href = "#"><button class = "signup">Sign Up</button></a>
    </header>
    </div>
      <div className='messages'>
        <ul>
          {newMessagesArray().map((msg, index) => [
            <li key={index} className='message'>
              <img alt='avatar' src={msg.avi} />
              <div>
                {msg.content}
                <span>{msg.name}</span>
              </div>
            </li>
          ])}
        </ul>
      </div>
      <div className='input-box'>
        <input placeholder='Type a message...' onChange={e => setMessageText(e.target.value)} value={messageText} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </main>
    </div>
}

export default App