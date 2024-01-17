import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Importa el archivo de estilos

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implementa la lógica para obtener el token utilizando la API
    // Puedes utilizar la función fetch o alguna librería como axios.
  };

  return (
    <div className="background-gradient">
      <div className="container mt-5">
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
        </div>
      </div>
    </div>
  );
}

export default App;
