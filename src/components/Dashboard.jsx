import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/dashboard', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Erro ao carregar usuários');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3001/users/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        await axios.post('http://localhost:3001/users', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      setFormData({ email: '', password: '' });
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      setError('Erro ao salvar usuário');
    }
  };

  const handleEdit = (user) => {
    setFormData({ email: user.email, password: '' });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await axios.delete(`http://localhost:3001/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchUsers();
      } catch (error) {
        setError('Erro ao excluir usuário');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <button onClick={handleLogout} className="logout-button">Sair</button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="user-form">
        <h3>{editingId ? 'Editar Usuário' : 'Novo Usuário'}</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Digite o email"
              required
            />
          </div>
          <div>
            <label>Senha:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={editingId ? "Deixe em branco para manter a senha atual" : "Digite a senha"}
              required={!editingId}
            />
          </div>
          <button type="submit">
            {editingId ? 'Atualizar' : 'Adicionar'}
          </button>
          {editingId && (
            <button type="button" onClick={() => {
              setEditingId(null);
              setFormData({ email: '', password: '' });
            }}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className="users-list">
        <h3>Lista de Usuários</h3>
        {users.length === 0 ? (
          <p>Nenhum usuário encontrado</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <span>{user.email}</span>
                <div className="user-actions">
                  <button onClick={() => handleEdit(user)} className="edit-button">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="delete-button">
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 