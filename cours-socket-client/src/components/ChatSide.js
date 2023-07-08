import React, { useEffect, useState } from 'react'

function ChatSide({socket, users }) {

  return (
    <div className='chat-side'>
      <h2 className="chat-header">Users connected :</h2>
      <ul className='chat-users'>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  )
}

export default ChatSide