import React, { useState, useEffect } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';

function EmployeeList({ token }) {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    department: '',
  });
  const [editEmployee, setEditEmployee] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

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
      } else {
        console.error('Error al crear empleado:', response.statusText);
      }
    } catch (error) {
      console.error('Error durante la creación de empleado:', error);
    }
  };

  const handleUpdate = async () => {
    // Lógica de actualización similar a tu implementación actual
    // ...
  };

  const handleDelete = async (employeeId) => {
    // Lógica de eliminación similar a tu implementación actual
    // ...
  };

  const handleEdit = (employee) => {
    setEditEmployee({ ...employee });
  };

  const handleCancelEdit = () => {
    setEditEmployee(null);
  };

  return (
    <div>
      <h2>Lista de Empleados</h2>
      <button onClick={() => setShowAddForm(true)}>Agregar Nuevo Empleado</button>

      {showAddForm && (
        <div>
          <h3>Nuevo Empleado</h3>
          <form>
            {/* Agregar campos del formulario y manejar cambios en el estado de newEmployee */}
            <button type="button" onClick={handleCreate}>
              Guardar Empleado
            </button>
            <button type="button" onClick={() => setShowAddForm(false)}>
              Cancelar
            </button>
          </form>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Departamento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>
                <FaRegEdit onClick={() => handleEdit(employee)} />
                <FaRegTrashAlt onClick={() => handleDelete(employee.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
