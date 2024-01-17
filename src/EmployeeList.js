import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EmployeeList.css';

function EmployeeList({ token }) {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    department: '',
  });
  const [editEmployee, setEditEmployee] = useState(null);

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
      } else {
        console.error('Error al crear empleado:', response.statusText);
      }
    } catch (error) {
      console.error('Error durante la creación de empleado:', error);
    }
  };

  const handleUpdate = async () => {
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
        const updatedEmployees = employees.map((emp) =>
          emp.id === editEmployee.id ? editEmployee : emp
        );
        setEmployees(updatedEmployees);
        setEditEmployee(null);
      } else {
        console.error('Error al actualizar empleado:', response.statusText);
      }
    } catch (error) {
      console.error('Error durante la actualización de empleado:', error);
    }
  };

  const handleDelete = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:5146/api/Employee/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
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
  };

  const handleCancelEdit = () => {
    setEditEmployee(null);
  };

  return (
    <div className="card login-box">
      <div className="card-body">
        <h2>Crear Nuevo Empleado</h2>
        <form>
          <div className="user-box">
            <label>Nombre:</label>
            <input
              type="text"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
            />
          </div>
          <div className="user-box">
            <label>Email:</label>
            <input
              type="text"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
            />
          </div>
          <div className="user-box">
            <label>Departamento:</label>
            <input
              type="text"
              value={newEmployee.department}
              onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
            />
          </div>
          <button className="btn btn-success butom-box" onClick={handleCreate}>
            Crear
          </button>
          
          {editEmployee && (
            <>
              <h2>Editar Empleado</h2>
              <div>
                <label>Nombre:</label>
                <input
                  type="text"
                  value={editEmployee.name}
                  onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value })}
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="text"
                  value={editEmployee.email}
                  onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })}
                />
              </div>
              <div>
                <label>Departamento:</label>
                <input
                  type="text"
                  value={editEmployee.department}
                  onChange={(e) => setEditEmployee({ ...editEmployee, department: e.target.value })}
                />
              </div>
              <button className="btn btn-primary" onClick={handleUpdate}>
                Actualizar
              </button>
              <button className="btn btn-secondary ml-2" onClick={handleCancelEdit}>
                Cancelar
              </button>
            </>
          )}
        </form>
        <h2 className="mt-4">Lista de Empleados</h2>
        <table className="table">
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
                  <button className="btn btn-info" onClick={() => handleEdit(employee)}>
                    Editar
                  </button>
                  <button className="btn btn-danger ml-2" onClick={() => handleDelete(employee.id)}>
                    Eliminar
                  </button>
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
