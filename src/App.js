import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import EmployeeList from './EmployeeList';

function App() {
  // Estados para manejar el formulario de inicio de sesión
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [token, setToken] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState('');

  // Función para manejar el intento de inicio de sesión
  const handleLogin = async () => {
    setUsernameError('');
    setPasswordError('');

    // Validaciones de campos de usuario y contraseña
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
      // Petición al servidor para autenticar el usuario
      const response = await fetch('http://localhost:5146/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Si la autenticación es exitosa, se actualizan los estados
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
        // Manejo de errores de autenticación
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
      // Manejo de errores de red
      console.error('Error durante el inicio de sesión:', error);
      setUsernameError('Error durante la autenticación');
    }
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    setLoggedInUser('');
    setToken('');
    setShowEmployeeList(false);
  };

  // Renderizado del componente
  return (
    <div className="background-gradient">
      <div className="container mt-5">
        {showEmployeeList ? (
          // Si el usuario está autenticado, se muestra la lista de empleados
          <EmployeeList token={token} username={loggedInUser} onLogout={handleLogout} />
        ) : (
          // Si el usuario no está autenticado, se muestra el formulario de inicio de sesión
          <div className="card login-box">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Login</h2>
              <form>
                {/* Campos de usuario y contraseña */}
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
                {/* Botón de inicio de sesión */}
                <button type="button" className="" onClick={handleLogin}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  Login
                </button>
              </form>
            </div>
            {/* Mensajes de error */}
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
