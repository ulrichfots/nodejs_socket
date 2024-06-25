import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [name, setName] = useState('anonymous');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [messages, setMessages] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    socket.emit('setUsername', name);

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('privateMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('updateUserList', (users) => {
      setUserList(users);
    });

    socket.on('userCount', (userTotal) => {
      setUserCount(userTotal);
    });

    socket.on('typing', (user) => {
      if (!selectedUser || selectedUser === user.recipientId) {
        setFeedback(`${user.name} is typing...`);
      }
    });

    socket.on('stopTyping', (user) => {
      if (!selectedUser || selectedUser === user.recipientId) {
        setFeedback('');
      }
    });

    return () => {
      socket.off('message');
      socket.off('privateMessage');
      socket.off('userCount');
      socket.off('typing');
      socket.off('stopTyping');
      socket.off('updateUserList');
    };
  }, [messages, feedback, userList, selectedUser]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    socket.emit('setUsername', e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (selectedUser) {
      socket.emit('typing', { name, recipientId: selectedUser });
    } else {
      socket.emit('typing', { name });
    }
  };

  const handleMessageSend = (e) => {
    e.preventDefault();
    const newMessage = {
      text: message,
      author: name,
      date: new Date().toLocaleString(),
      senderId: socket.id,
      recipientId: selectedUser,
    };
    if (selectedUser) {
      socket.emit('privateMessage', newMessage);
    } else {
      socket.emit('message', newMessage);
    }
    setMessage('');
    socket.emit('stopTyping', { recipientId: selectedUser });
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };

  return (
    <>
      <h1 className='title'>iChat</h1>
      <div className="mainChat">
        <div className="flex">
          <div className="userList">
            <h3>Users : {userCount}</h3>
            <ul>
              <li onClick={() => handleUserSelect(null)}>All</li>
              {Object.keys(userList).map((user, index) => (
                <li key={index} className='' onClick={() => handleUserSelect(user)}>
                  {userList[user]}
                </li>
              ))}
            </ul>
          </div>
          <div className="chat">
            <div className="name">
              <span className="nameForm">
                <FontAwesomeIcon icon={faUser} />
                <input
                  type="text"
                  className="nameInput"
                  id="nameInput"
                  value={name}
                  onChange={handleNameChange}
                  maxLength="20"
                />
              </span>
            </div>
            <ul className="conversation">
              {messages
                .filter((msg) => {
                  if (!selectedUser) {
                    return !msg.recipientId;
                  } else {
                    return (
                      (msg.senderId === socket.id && msg.recipientId === selectedUser) ||
                      (msg.senderId === selectedUser && msg.recipientId === socket.id)
                    );
                  }
                })
                .map((msg, index) => (
                  <li key={index} className={msg.senderId === socket.id ? 'messageRight' : 'messageLeft'}>
                    <p className="message">{msg.text}</p>
                    <span>{msg.author} - {msg.date}</span>
                  </li>
                ))}
              {feedback && (
                <li className="messageFeedback">
                  <p className="feedback">{feedback}</p>
                </li>
              )}
            </ul>
            <form className="messageForm" onSubmit={handleMessageSend}>
              <input
                type="text"
                name="message"
                className='messageInput'
                value={message}
                onKeyUp={() => {
                  if (!message) {
                    socket.emit('stopTyping', { recipientId: selectedUser });
                  }
                }}
                onChange={handleMessageChange}
              />
              <div className="vDivider"></div>
              <button type="submit" className='sendButton'>Send <FontAwesomeIcon icon={faPaperPlane} /></button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
