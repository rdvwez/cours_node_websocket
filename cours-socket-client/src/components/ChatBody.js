import React from 'react';
import { useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development';

function ChatBody({messages}) {
  const navigate = useNavigate();

  const leaveChat = () => {
    localStorage.removeItem('username');
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
            <div key={message.id} className="message-chats">
              <p className="sender-name">{message.name}</p>
              <div className='message-sender'>
                <p>{message.text}</p>
              </div>
            </div>
            ) : (
            <div className="message-chats">
              <p className="sender-name">{message.name}</p>
              <div className='message-recipient'>
                <p>{message.text}</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default ChatBody