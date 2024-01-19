import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import EmployeeList from './EmployeeList';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [token, setToken] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState('');

  const handleLogin = async () => {
    setUsernameError('');
    setPasswordError('');

    if (!username.trim()) {
      setUsernameError('Usuario no puede estar vacío.');
    }

    if (!password.trim()) {
      setPasswordError('Contraseña no puede estar vacía.');
    }

    if (usernameError || passwordError) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5146/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const authToken = data.token;

        if (authToken) {
          setToken(authToken);
          setLoggedInUser(username);
          setShowEmployeeList(true);
        } else {
          setUsernameError('Credenciales inválidas.');
        }
      } else {
        const errorData = await response.json();
        if (errorData.message === 'Invalid username') {
          setUsernameError('Nombre de usuario ingresado incorrecto.');
        } else if (errorData.message === 'Invalid password') {
          setPasswordError('Contraseña ingresada incorrecta.');
        } else {
          setUsernameError('Error de autenticación.');
        }
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      setUsernameError('Error durante la autenticación');
    }
  };

  const handleLogout = () => {
    setLoggedInUser('');
    setToken('');
    setShowEmployeeList(false);
  };

  return (
    <div className="background-gradient">
      <div className="container mt-5">
        {showEmployeeList ? (
          <EmployeeList token={token} username={loggedInUser} onLogout={handleLogout} />
        ) : (
          <div className="card login-box">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Login</h2>
              <form>
                <div className="user-box">
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label htmlFor="username" className="form-label">
                    Usuario
                  </label>
                </div>
                <div className="user-box">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                </div>
                <button type="button" className="" onClick={handleLogin}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  Login
                </button>
              </form>
            </div>
            {usernameError && (
              <div className="alert alert-danger mt-2">{usernameError}</div>
            )}
            {passwordError && (
              <div className="alert alert-danger mt-2">{passwordError}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
