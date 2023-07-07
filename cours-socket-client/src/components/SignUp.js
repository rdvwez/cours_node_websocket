import {React, useState} from 'react';
import { useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development';
import axios from 'axios';

function SignUp({socket}) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // const handleSubmit = () => {
    //   localStorage.setItem('username', username);
    //   // On crée un nouvel user
    //   socket.emit('new_user', {username, socketID: socket.id});
    //   navigate('/chat');
    // }

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Validation des champs
        if (username === '' || password === '') {
          setError('Veuillez remplir tous les champs');
          return;
        }
    
        // Effectuer ici votre logique de connexion
        // Par exemple, envoyer une requête au serveur
        axios.post('http://localhost:3001/user/', {
            username:username ,
            password: password
          })
          .then(function (response) {
            const token = response.data.token;
            localStorage.setItem('username', username);
            localStorage.setItem('token', token);

            // localStorage.setItem('username', username);
      // On crée un nouvel user
            socket.emit('new_user', {username, socketID: socket.id});
            navigate('/chat');
          })
          .catch(function (error) {
            setError(error.response.data.message)
          });
    
        // Réinitialiser les champs
        setUsername('');
        setPassword('');
        setError('');
    
      };

    return (
      <div className="home-container">
        <h2>Sign Up</h2>
        {error && <p className='error_message'>{error}</p>}

        <form onSubmit={handleSubmit}>
            <div>
                <label>Username :  </label>
                <input
                    type="text"
                    className="user-input"
                    placeholder='Your Name...'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <br/>
            <div>
                <label>Password :  </label>
                <input
                    type="password"
                    className="user-input"
                    placeholder='Your Password...'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
        </div>
        <br/>
        <button type="submit" className="home-btn"  >Sign Up</button>
      </form>

      </div>
    )
}

export default SignUp