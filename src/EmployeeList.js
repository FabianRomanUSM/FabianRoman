import React, { useState, useEffect } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';

// Componente principal para la lista de empleados
function EmployeeList({ token, username, onLogout }) {
  // Estado para almacenar la lista de empleados
  const [employees, setEmployees] = useState([]);
  
  // Estado para el nuevo empleado
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    department: '',
  });

  // Estado para el empleado en modo edición
  const [editEmployee, setEditEmployee] = useState(null);

  // Estados para controlar la visibilidad de formularios y mensajes de error
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Efecto secundario para obtener la lista de empleados al cargar la página o cambiar el token
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:5146/api/Employee', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEmployees(data);
        } else {
          console.error('Error al obtener empleados:', response.statusText);
        }
      } catch (error) {
        console.error('Error en la solicitud de empleados:', error);
      }
    };

    fetchEmployees();
  }, [token]);

  // Función para validar el formato de un email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para manejar la creación de un nuevo empleado
  const handleCreate = async () => {
    // Validar campos obligatorios y formato de email
    if (
      !newEmployee.name.trim() ||
      !newEmployee.email.trim() ||
      !newEmployee.department.trim() ||
      !isValidEmail(newEmployee.email)
    ) {
      setErrorMessage('Por favor, complete todos los campos obligatorios y asegúrese de que el email sea válido.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5146/api/Employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEmployee),
      });

      if (response.ok) {
        const data = await response.json();
        // Actualizar la lista de empleados en el estado
        setEmployees([...employees, data]);
        // Limpiar el estado del nuevo empleado y ocultar el formulario
        setNewEmployee({ name: '', email: '', department: '' });
        setShowAddForm(false);
        setErrorMessage('');
      } else {
        console.error('Error al crear empleado:', response.statusText);
      }
    } catch (error) {
      console.error('Error durante la creación de empleado:', error);
    }
  };

  // Función para manejar la actualización de un empleado existente
  const handleUpdate = async () => {
    // Validar campos obligatorios y formato de email
    if (
      !editEmployee.name.trim() ||
      !editEmployee.email.trim() ||
      !editEmployee.department.trim() ||
      !isValidEmail(editEmployee.email)
    ) {
      setErrorMessage('Por favor, complete todos los campos obligatorios y asegúrese de que el email sea válido.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5146/api/Employee/${editEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editEmployee),
      });

      if (response.ok) {
        // Actualizar la lista de empleados en el estado
        const updatedEmployees = employees.map((emp) =>
          emp.id === editEmployee.id ? editEmployee : emp
        );
        setEmployees(updatedEmployees);

        // Limpiar el estado de edición y ocultar el formulario
        setEditEmployee(null);
        setShowEditForm(false);
        setErrorMessage('');
      } else {
        console.error('Error al actualizar empleado:', response.statusText);
      }
    } catch (error) {
      console.error('Error durante la actualización de empleado:', error);
    }
  };

    // Función para manejar la eliminación de un empleado
    const handleDelete = async (employeeId) => {
    // Mostrar mensaje de confirmación
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este empleado?');

    if (!confirmDelete) {
      return; // Si el usuario cancela, no realizar la eliminación
    }

    try {
      const response = await fetch(`http://localhost:5146/api/Employee/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Eliminar el empleado de la lista en el estado
        const updatedEmployees = employees.filter((emp) => emp.id !== employeeId);
        setEmployees(updatedEmployees);
      } else {
        console.error('Error al eliminar empleado:', response.statusText);
      }
    } catch (error) {
      console.error('Error durante la eliminación de empleado:', error);
    }
  };

  // Función para manejar la edición de un empleado
  const handleEdit = (employee) => {
    setEditEmployee({ ...employee });
    setShowEditForm(true);
    setErrorMessage('');
  };

  // Función para cancelar la edición
  const handleCancelEdit = () => {
    setEditEmployee(null);
    setShowEditForm(false);
    setErrorMessage('');
  };

  return (
    <div>
      {/* Sección de bienvenida y botón de desconexión */}
      <div className="employee-box">
        <h2>Bienvenido, {username}!</h2>
        <button type="button" onClick={onLogout}>
          Desconectar
        </button>
      </div>

      {/* Sección para agregar nuevo empleado */}
      <div className="employee-box">
        <button type="button" onClick={() => setShowAddForm(true)}>
          Agregar Nuevo Empleado
        </button>
        {showAddForm && (
          <div className="">
            <h3>Nuevo Empleado</h3>
            <form>
              <label className="">
                Nombre y Apellido:
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                />
              </label>
              <label>
                Email:
                <input
                  type="text"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                />
              </label>
              <label>
                Departamento:
                <input
                  type="text"
                  value={newEmployee.department}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, department: e.target.value })
                  }
                />
              </label>
              <button type="button" onClick={handleCreate}>
                Guardar Empleado
              </button>
              <button type="button" onClick={() => setShowAddForm(false)}>
                Cancelar
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Sección para mostrar mensajes de error */}
      {errorMessage && <div className="alert alert-danger mt-2">{errorMessage}</div>}

      {/* Sección para mostrar la lista de empleados y formulario de edición */}
      <div className="employee-box">
        <h2>Lista de Empleados</h2>
        {showEditForm && (
          <div>
            <h3>Editar Empleado</h3>
            <form>
              <label>
                Nombre y Apellido:
                <input
                  type="text"
                  value={editEmployee?.name || ''}
                  onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value })}
                />
              </label>
              <label>
                Email:
                <input
                  type="text"
                  value={editEmployee?.email || ''}
                  onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })}
                />
              </label>
              <label>
                Departamento:
                <input
                  type="text"
                  value={editEmployee?.department || ''}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, department: e.target.value })
                  }
                />
              </label>
              <button type="button" onClick={handleUpdate}>
                Guardar Cambios
              </button>
              <button type="button" onClick={handleCancelEdit}>
                Cancelar
              </button>
            </form>
          </div>
        )}

        {/* Tabla para mostrar la lista de empleados */}
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Departamento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>
                  <FaRegEdit onClick={() => handleEdit(employee)} className="icon" />
                  <FaRegTrashAlt onClick={() => handleDelete(employee.id)} className="icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
    
export default EmployeeList;
    