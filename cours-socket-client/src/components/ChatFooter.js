import React, { useState } from 'react'

function ChatFooter({socket}) {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    // alert(localStorage.getItem('token'))
    if (message !== '' && localStorage.getItem('username')) {
      console.log()
      console.log(message)
      socket.emit('send_message', {
        text: message,
        id: socket.id,
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