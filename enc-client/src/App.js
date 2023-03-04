import '.App.css'
import { useEffect, useState, useReducer } from 'react'
import Gun from 'gun'
import faker from '@faker-js/faker'
import './App.css';

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
      sender: faker.name.firstName(),
      avatar: faker.image.avatar(),
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
      <div className='messages'>
        <ul> //renders out the msgs
          {state.messages.map((msg, index) => [
            <li key={index} className='message'>
              <img alt='avatar' src={msg.avatar} />
              <div>
                {msg.content}
                <span>{msg.sender}</span>
              </div>
            </li>
          ])}
        </ul>
      </div>
      <div className='input-box'> //for typing
        <input placeholder='Type a message...' onChange={e => setMessageText(e.target.value)} value={messageText} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </main>
  </div>

}

export default App