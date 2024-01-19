import React, { useState, useEffect } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';

function EmployeeList({ token, username, onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    department: '',
  });
  const [editEmployee, setEditEmployee] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleCreate = async () => {
    // Validar campos obligatorios
    if (!newEmployee.name.trim() || !newEmployee.email.trim() || !newEmployee.department.trim()) {
      setErrorMessage('Por favor, complete todos los campos obligatorios.');
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
        setEmployees([...employees, data]);
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

  const handleUpdate = async () => {
    // Validar campos obligatorios
    if (!editEmployee.name.trim() || !editEmployee.email.trim() || !editEmployee.department.trim()) {
      setErrorMessage('Por favor, complete todos los campos obligatorios.');
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

        // Limpiar el estado de edición
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
  

  const handleEdit = (employee) => {
    setEditEmployee({ ...employee });
    setShowEditForm(true);
    setErrorMessage('');
  };

  const handleCancelEdit = () => {
    setEditEmployee(null);
    setShowEditForm(false);
    setErrorMessage('');
  };

  return (
    <div>
       <div className="employee-box">
        <h2>Bienvenido, {username}!</h2>
        <button type="button" onClick={onLogout}>
          Desconectar
        </button>
      </div>

      
      <div className="employee-box">
      <button type="button" onClick={() => setShowAddForm(true)}>Agregar Nuevo Empleado</button>
      {showAddForm && (
        <div className="">
          <h3>Nuevo Empleado</h3>
          <form>
            <label className="">
              Nombre:
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
      {errorMessage && <div className="alert alert-danger mt-2">{errorMessage}</div>}
      <div className="employee-box">
      <h2>Lista de Empleados</h2>
      {showEditForm && (
        <div>
          <h3>Editar Empleado</h3>
          <form>
            <label>
              Nombre:
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
                onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value
                })}
                />
              </label>
              <label>
                Departamento:
                <input
                  type="text"
                  value={editEmployee?.department || ''}
                  onChange={(e) => setEditEmployee({ ...editEmployee, department: e.target.value })}
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
    