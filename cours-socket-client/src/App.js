import './App.css';
import Home from './components/Home';
import Chat from './components/Chat';
import SignUp from './components/SignUp';
import io from 'socket.io-client';
import {BrowserRouter, Routes, Route} from 'react-router-dom/dist/umd/react-router-dom.development';

const socket = io.connect('http://localhost:3001');

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home socket={socket}/>}></Route>
          <Route path="/chat" element={<Chat socket={socket}/>}></Route>
          <Route path="/signup" element={<SignUp socket={socket}/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;