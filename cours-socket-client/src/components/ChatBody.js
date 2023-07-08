import React from 'react';
import { useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development';
import axios from 'axios';

function ChatBody({messages, socket}) {
  const navigate = useNavigate();

  const leaveChat = () => {
    

    axios.post('http://localhost:3001/auth/logout/',
     { },
     {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    }
     )
    .then((response) => {
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      socket.emit('disconnect', { });

    })
    .catch((error) => {
      console.log(error);
    
    });


    navigate('/');
    window.location.reload();
  }

  return (
    <div>
      <header className="chatBody-header">
        <p>Welcome to Chat !</p>
        <button className="leave-btn" onClick={leaveChat}>Leave</button>
      </header>

      <div className='message-container'>
        {messages.map((message) => 
            message.name === localStorage.getItem('username') ? (
            <div key={message.socketID} className="message-chats">
              <p className="sender-name">{message.name}</p>
              <div className='message-sender'>
                <p>{message.content}</p>
              </div>
            </div>
            ) : (
            <div className="message-chats">
              <p className="sender-name">{message.name}</p>
              <div className='message-recipient'>
                <p>{message.content}</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default ChatBody