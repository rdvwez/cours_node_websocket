import React, { useState } from 'react'

function ChatFooter({socket, users }) {
  const [message, setMessage] = useState('');
  const sendMessage = () => {
    if (message !== '' && localStorage.getItem('username')) {
      
      console.log(message)
      socket.emit('send_message', {
        content: message,
        socketID: socket.id,
        receiversId: users.map(user => user.id),
        name: localStorage.getItem('username'),
        token: localStorage.getItem('token')
      });
      setMessage('');
    }
  };

  return (
    <div className='chat-footer'>
      <div className='form'>
        <input 
          type="text"
          className="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            event.key === "Enter" && sendMessage()
          }}
          placeholder="Your Message..."
        />
        <button className="sendBtn" onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default ChatFooter