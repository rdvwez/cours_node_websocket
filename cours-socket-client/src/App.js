
import './App.css';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';

const socket = io.connect('http://localhost:3001')

function App() {

  const [message, setMessage] = useState("")

  const [messageReceived, setMessageRecieved] = useState("")

  const sendMessage = () => {
    socket.emit("send_message", {message:message})
  };

  useEffect(() =>{
    socket.on("recieve_massaga", (data) =>{
      setMessageRecieved(data.message)
      });
  }, [socket]);

  return (
    <div className="App">
     <input placeholder='Meassage ...' onChange={(event) => {
      setMessage(event.target.value);
     }} />
    <button onClick={sendMessage}> Send Meassage </button>
    <p>{messageReceived}</p>
    </div>
  );
}

export default App;
