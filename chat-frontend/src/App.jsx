import './App.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

// pour importer et se connecter au backend
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/');

function App() {
  // on déclare 2 states, donc l'équivalent des avriables, qui me permettront de conserver le name ainsi que le message
  const [name, setName] = useState('anonymous');
  const [message, setMessage] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  }
  return (
    <>
      <h1 className='title'>iChat</h1>
      <div className="mainChat">

      <div className="flex">

      <div className="slidebar">
          <h3>Connected users</h3>
          <ul>
            <li>Anonymous</li>
            <li>Toto</li>
            <li>Bubu</li>
          </ul>
          <p>Number of connected users: 3</p>
        </div>


        <div className="chat">

<div className="name">
  <span className="nameForm">
    <FontAwesomeIcon icon={faUser} />
    <input type="text"
      className="nameInput"
      id="nameInput"
      value={name}
      onChange={handleNameChange}
      maxLength="20"
    />
  </span>
</div>
<ul className="conversation">
  <li className="messageLeft">
    <p className="message">Bonjour tout le monde !</p>
    <span>author - 18 juin 2024</span>
  </li>
  <li className="messageRight">
    <p className="message">Ca va?</p>
    <span>author - 18 juin 2024</span>
  </li>
  <li className="messageFeedback">
    <p className="feedback">Toto is typing...</p>
  </li>
</ul>
<form className="messageForm">
  <input type="text" name="message" className='messageInput'
  //  value={message}
  //  onChange={handleMessageChange} 
   />
  <div className="vDivider"></div>
  <button type="submit" className="sendButton">Send <FontAwesomeIcon icon={faPaperPlane}/></button>
</form>
</div>
      </div>


      </div>
    </>
  )
}

export default App
