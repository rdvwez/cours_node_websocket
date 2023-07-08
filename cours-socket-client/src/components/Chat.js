import React, { useEffect, useState } from 'react'
import ChatSide from './ChatSide';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

function Chat({socket}) {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on('receive_message', (data) => {
            //data contien le drnier message qui vien d'est publier sur le forum, on tl'joute aux precedants
            setMessages([...messages, data]);
        });
    }, [socket, messages]);
    console.log(messages)

  useEffect(() => {
    socket.on('receive_users', (data) => {
      setUsers(data);
      console.log(data);
    })
  }, [socket, users]);

  return (
    <div className='chat'>
        <ChatSide socket={socket} users={users}  />
        <div className='chat-main'>
            <ChatBody messages={messages} socket={socket} />
            <ChatFooter socket={socket} users={users} />
        </div>
    </div>
  )
}

export default Chat