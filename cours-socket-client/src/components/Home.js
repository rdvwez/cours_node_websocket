import {React, useState} from 'react';
import { useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home({socket}) {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();

      if (username === '' || password === '') {
        setError('Veuillez remplir tous les champs');
        return;
      }

      // Effectuer ici votre logique de connexion
      //   Par exemple, envoyer une requête au serveur
      axios.post('http://localhost:3001/auth/login/', {
          username:username ,
          password: password
        })
        .then((response) => {
          
          const token = response.data.token;
          localStorage.setItem('token', token);
          localStorage.setItem('username', username);
          
          socket.emit('new_user', {username, socketID: socket.id});
          navigate('/chat');

        })
        .catch((error) => {
          setError(error.response.data.message)
          console.log(error);
        
        });

        setUsername('');
        setPassword('');
        setError('');

      
    }

    return (
      <div className="home-container">
        <h2>Sign in</h2>
        {error && <p className='error_message'>{error}</p>}

        <form >
            
                <label>Username :  </label>
                <input
                    type="text"
                    className="user-input"
                    placeholder='Your Name...'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(event) => {
                      event.key === "Enter" && handleSubmit()
                    }}
                />
            <br/>
            <br/>
            
                <label>Password :  </label>
                <input
                    type="password"
                    className="user-input"
                    placeholder='Your Password...'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(event) => {
                      event.key === "Enter" && handleSubmit()
                    }}
                />
        <br/>

        <br/>
        <button className="home-btn" onClick={handleSubmit}>Connexion</button>
      </form>


        <p>Pas de compte? <Link to="/signup">Créez en un</Link></p>
      </div>
    )
}

export default Home