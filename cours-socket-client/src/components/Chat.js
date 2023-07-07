import React, { useEffect, useState } from 'react'
import ChatSide from './ChatSide';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

function Chat({socket}) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessages([...messages, data]);
        });
    }, [socket, messages]);

  return (
    <div className='chat'>
        <ChatSide socket={socket} />
        <div className='chat-main'>
            <ChatBody messages={messages} />
            <ChatFooter socket={socket}/>
        </div>
    </div>
  )
}

export default Chat